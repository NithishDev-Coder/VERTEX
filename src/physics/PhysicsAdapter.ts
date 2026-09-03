import type {
  ColliderOptions,
  PhysicsObjectState,
  PhysicsWorldOptions,
  RigidBodyOptions,
  SimulationLifecycle,
  Vector3,
} from './types';

/** Boundary that prevents application code from depending on Rapier directly. */
export interface PhysicsAdapter {
  initialize(options?: PhysicsWorldOptions): Promise<void>;
  createRigidBody(options: RigidBodyOptions): void;
  createCollider(options: ColliderOptions): void;
  step(steps?: number): void;
  pause(): void;
  resume(): void;
  stop(): void;
  reset(): void;
  getObjectState(objectId: string): PhysicsObjectState | undefined;
  getGravity(): Vector3;
  getSimulationTime(): number;
  getLifecycle(): SimulationLifecycle;
  dispose(): void;
}
