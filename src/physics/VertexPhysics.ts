import type { PhysicsAdapter } from './PhysicsAdapter';
import { RapierPhysicsAdapter } from './RapierPhysicsAdapter';
import type { ColliderOptions, PhysicsObjectState, PhysicsWorldOptions, RigidBodyOptions, SimulationLifecycle, Vector3 } from './types';

/** Application-facing physics capability layer. Rendering code consumes state snapshots only. */
export class VertexPhysics {
  constructor(private readonly adapter: PhysicsAdapter = new RapierPhysicsAdapter()) {}
  initialize(options?: PhysicsWorldOptions): Promise<void> { return this.adapter.initialize(options); }
  createRigidBody(options: RigidBodyOptions): void { this.adapter.createRigidBody(options); }
  createCollider(options: ColliderOptions): void { this.adapter.createCollider(options); }
  start(): void { this.adapter.resume(); }
  pause(): void { this.adapter.pause(); }
  resume(): void { this.adapter.resume(); }
  stop(): void { this.adapter.stop(); }
  reset(): void { this.adapter.reset(); }
  step(steps = 1): void { this.adapter.step(steps); }
  getObjectState(objectId: string): PhysicsObjectState | undefined { return this.adapter.getObjectState(objectId); }
  getGravity(): Vector3 { return this.adapter.getGravity(); }
  getSimulationTime(): number { return this.adapter.getSimulationTime(); }
  getLifecycle(): SimulationLifecycle { return this.adapter.getLifecycle(); }
  dispose(): void { this.adapter.dispose(); }
}
