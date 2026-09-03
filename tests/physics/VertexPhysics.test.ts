import { afterEach, describe, expect, it } from 'vitest';
import { createFallingBlockScenario, EARTH_GRAVITY, VertexPhysics } from '../../src/physics';

const simulations: VertexPhysics[] = [];
const createSimulation = async (): Promise<VertexPhysics> => {
  const physics = new VertexPhysics();
  await physics.initialize();
  simulations.push(physics);
  return physics;
};

afterEach(() => simulations.splice(0).forEach((physics) => physics.dispose()));

describe('VertexPhysics Day 1 foundation', () => {
  it('initializes an Earth-gravity world in the READY lifecycle', async () => {
    const physics = await createSimulation();
    expect(physics.getLifecycle()).toBe('READY');
    expect(physics.getGravity()).toEqual(EARTH_GRAVITY);
  });

  it('creates a dynamic rigid body, collider, and exposes its state', async () => {
    const physics = await createSimulation();
    physics.createRigidBody({ objectId: 'ball', type: 'dynamic', position: { x: 1, y: 3, z: 2 } });
    physics.createCollider({ objectId: 'ball-collider', bodyId: 'ball', shape: 'ball', dimensions: 0.5 });
    expect(physics.getObjectState('ball')).toMatchObject({ objectId: 'ball', position: { x: 1, y: 3, z: 2 }, simulationTime: 0 });
  });

  it('moves a dynamic body under actual Rapier gravity with a fixed timestep', async () => {
    const physics = await createSimulation();
    physics.createRigidBody({ objectId: 'block', type: 'dynamic', position: { x: 0, y: 5, z: 0 } });
    physics.createCollider({ objectId: 'block-collider', bodyId: 'block', shape: 'cuboid', dimensions: { x: 0.5, y: 0.5, z: 0.5 } });
    physics.start();
    physics.step(60);
    const state = physics.getObjectState('block')!;
    expect(state.position.y).toBeLessThan(5);
    expect(state.velocity.y).toBeLessThan(0);
    expect(state.simulationTime).toBeCloseTo(1, 10);
  });

  it('collides with static ground and comes to rest above it', async () => {
    const physics = await createSimulation();
    createFallingBlockScenario(physics);
    physics.start();
    physics.step(360);
    const block = physics.getObjectState('falling-block')!;
    expect(block.position.y).toBeGreaterThanOrEqual(0.49);
    expect(block.position.y).toBeLessThan(0.6);
    expect(Math.abs(block.velocity.y)).toBeLessThan(0.05);
  });

  it('does not advance while paused and continues after resume', async () => {
    const physics = await createSimulation();
    physics.createRigidBody({ objectId: 'block', type: 'dynamic', position: { x: 0, y: 5, z: 0 } });
    physics.createCollider({ objectId: 'block-collider', bodyId: 'block', shape: 'ball', dimensions: 0.5 });
    physics.start(); physics.step(1);
    physics.pause();
    const paused = physics.getObjectState('block')!;
    physics.step(20);
    expect(physics.getObjectState('block')).toEqual(paused);
    physics.resume(); physics.step(1);
    expect(physics.getObjectState('block')!.simulationTime).toBeGreaterThan(paused.simulationTime);
  });

  it('resets initial bodies, state, and lifecycle', async () => {
    const physics = await createSimulation();
    physics.createRigidBody({ objectId: 'block', type: 'dynamic', position: { x: 0, y: 5, z: 0 } });
    physics.createCollider({ objectId: 'block-collider', bodyId: 'block', shape: 'ball', dimensions: 0.5 });
    physics.start(); physics.step(30); physics.reset();
    expect(physics.getLifecycle()).toBe('READY');
    expect(physics.getObjectState('block')).toMatchObject({ position: { x: 0, y: 5, z: 0 }, simulationTime: 0 });
  });
});
