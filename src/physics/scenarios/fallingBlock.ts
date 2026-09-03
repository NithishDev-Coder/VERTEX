import type { VertexPhysics } from '../VertexPhysics';

/** Minimal Day 1 scenario: a 1 m tall block falls onto a static ground plane. */
export function createFallingBlockScenario(physics: VertexPhysics): void {
  physics.createRigidBody({ objectId: 'ground', type: 'static', position: { x: 0, y: -0.5, z: 0 } });
  physics.createCollider({ objectId: 'ground-collider', bodyId: 'ground', shape: 'cuboid', dimensions: { x: 10, y: 0.5, z: 10 } });
  physics.createRigidBody({ objectId: 'falling-block', type: 'dynamic', position: { x: 0, y: 5, z: 0 } });
  physics.createCollider({ objectId: 'falling-block-collider', bodyId: 'falling-block', shape: 'cuboid', dimensions: { x: 0.5, y: 0.5, z: 0.5 }, friction: 0.8 });
}
