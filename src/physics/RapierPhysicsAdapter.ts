import RAPIER from '@dimforge/rapier3d-compat';
import type { PhysicsAdapter } from './PhysicsAdapter';
import {
  DEFAULT_FIXED_TIME_STEP,
  EARTH_GRAVITY,
  type ColliderOptions,
  type PhysicsObjectState,
  type PhysicsWorldOptions,
  type Quaternion,
  type RigidBodyOptions,
  type SimulationLifecycle,
  type Vector3,
} from './types';

const origin: Vector3 = { x: 0, y: 0, z: 0 };
const identity: Quaternion = { x: 0, y: 0, z: 0, w: 1 };
const copyVector = (value: Vector3 = origin): Vector3 => ({ ...value });
const copyRotation = (value: Quaternion = identity): Quaternion => ({ ...value });

/** Rapier-backed implementation. No UI or application configuration is referenced here. */
export class RapierPhysicsAdapter implements PhysicsAdapter {
  private world?: RAPIER.World;
  private readonly bodies = new Map<string, RAPIER.RigidBody>();
  private readonly bodyDefinitions = new Map<string, RigidBodyOptions>();
  private readonly colliderDefinitions: ColliderOptions[] = [];
  private gravity = copyVector(EARTH_GRAVITY);
  private fixedTimeStep = DEFAULT_FIXED_TIME_STEP;
  private simulationTime = 0;
  private lifecycle: SimulationLifecycle = 'STOPPED';

  async initialize(options: PhysicsWorldOptions = {}): Promise<void> {
    await RAPIER.init();
    this.gravity = copyVector(options.gravity ?? EARTH_GRAVITY);
    this.fixedTimeStep = options.fixedTimeStep ?? DEFAULT_FIXED_TIME_STEP;
    if (this.fixedTimeStep <= 0) throw new Error('fixedTimeStep must be greater than zero.');
    this.buildWorld();
    this.lifecycle = 'READY';
  }

  createRigidBody(options: RigidBodyOptions): void {
    const world = this.requireWorld();
    if (this.bodies.has(options.objectId)) throw new Error(`Rigid body already exists: ${options.objectId}`);
    const definition: RigidBodyOptions = {
      ...options, position: copyVector(options.position), rotation: copyRotation(options.rotation),
      velocity: copyVector(options.velocity), angularVelocity: copyVector(options.angularVelocity),
    };
    this.bodyDefinitions.set(definition.objectId, definition);
    this.bodies.set(definition.objectId, this.addBody(world, definition));
  }

  createCollider(options: ColliderOptions): void {
    const world = this.requireWorld();
    if (!this.bodies.has(options.bodyId)) throw new Error(`No rigid body exists for collider: ${options.bodyId}`);
    this.colliderDefinitions.push({ ...options, dimensions: typeof options.dimensions === 'number' ? options.dimensions : copyVector(options.dimensions) });
    this.addCollider(world, options);
  }

  step(steps = 1): void {
    if (!Number.isInteger(steps) || steps < 1) throw new Error('steps must be a positive integer.');
    if (this.lifecycle !== 'RUNNING') return;
    const world = this.requireWorld();
    for (let index = 0; index < steps; index += 1) {
      world.timestep = this.fixedTimeStep;
      world.step();
      this.simulationTime += this.fixedTimeStep;
    }
  }

  pause(): void { if (this.lifecycle === 'RUNNING') this.lifecycle = 'PAUSED'; }
  resume(): void { if (this.lifecycle === 'READY' || this.lifecycle === 'PAUSED') this.lifecycle = 'RUNNING'; }
  stop(): void { if (this.world) this.lifecycle = 'STOPPED'; }

  reset(): void {
    this.requireWorld();
    this.buildWorld();
    this.simulationTime = 0;
    this.lifecycle = 'READY';
  }

  getObjectState(objectId: string): PhysicsObjectState | undefined {
    const body = this.bodies.get(objectId);
    if (!body) return undefined;
    const position = body.translation(); const rotation = body.rotation();
    const velocity = body.linvel(); const angularVelocity = body.angvel();
    return {
      objectId, position: { x: position.x, y: position.y, z: position.z },
      rotation: { x: rotation.x, y: rotation.y, z: rotation.z, w: rotation.w },
      velocity: { x: velocity.x, y: velocity.y, z: velocity.z },
      angularVelocity: { x: angularVelocity.x, y: angularVelocity.y, z: angularVelocity.z },
      simulationTime: this.simulationTime,
    };
  }

  getGravity(): Vector3 { return copyVector(this.gravity); }
  getSimulationTime(): number { return this.simulationTime; }
  getLifecycle(): SimulationLifecycle { return this.lifecycle; }

  dispose(): void {
    this.world?.free(); this.world = undefined; this.bodies.clear(); this.bodyDefinitions.clear();
    this.colliderDefinitions.length = 0; this.simulationTime = 0; this.lifecycle = 'STOPPED';
  }

  private buildWorld(): void {
    this.world?.free();
    this.world = new RAPIER.World(this.gravity);
    this.world.timestep = this.fixedTimeStep;
    this.bodies.clear();
    for (const definition of this.bodyDefinitions.values()) this.bodies.set(definition.objectId, this.addBody(this.world, definition));
    for (const definition of this.colliderDefinitions) this.addCollider(this.world, definition);
  }

  private addBody(world: RAPIER.World, options: RigidBodyOptions): RAPIER.RigidBody {
    const desc = options.type === 'dynamic' ? RAPIER.RigidBodyDesc.dynamic() : RAPIER.RigidBodyDesc.fixed();
    const position = options.position ?? origin; const rotation = options.rotation ?? identity;
    desc.setTranslation(position.x, position.y, position.z).setRotation(rotation);
    if (options.velocity) desc.setLinvel(options.velocity.x, options.velocity.y, options.velocity.z);
    if (options.angularVelocity) desc.setAngvel(options.angularVelocity);
    return world.createRigidBody(desc);
  }

  private addCollider(world: RAPIER.World, options: ColliderOptions): void {
    const shape = options.shape === 'cuboid'
      ? (() => { const d = options.dimensions as Vector3; return RAPIER.ColliderDesc.cuboid(d.x, d.y, d.z); })()
      : RAPIER.ColliderDesc.ball(options.dimensions as number);
    if (options.restitution !== undefined) shape.setRestitution(options.restitution);
    if (options.friction !== undefined) shape.setFriction(options.friction);
    world.createCollider(shape, this.bodies.get(options.bodyId)!);
  }

  private requireWorld(): RAPIER.World {
    if (!this.world) throw new Error('Physics world is not initialized.');
    return this.world;
  }
}
