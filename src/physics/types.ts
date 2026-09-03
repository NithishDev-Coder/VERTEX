/** SI-unit three-dimensional vector. Position is metres; velocity is metres per second. */
export interface Vector3 { x: number; y: number; z: number }

/** Unit quaternion used for rigid-body orientation. */
export interface Quaternion { x: number; y: number; z: number; w: number }

export type RigidBodyType = 'dynamic' | 'static';
export type ColliderShape = 'cuboid' | 'ball';
export type SimulationLifecycle = 'READY' | 'RUNNING' | 'PAUSED' | 'STOPPED';

/** A rendering-safe snapshot. The physics engine remains the source of these values. */
export interface PhysicsObjectState {
  objectId: string;
  position: Vector3;
  rotation: Quaternion;
  /** Linear velocity in m/s. */
  velocity: Vector3;
  /** Angular velocity in radians/s. */
  angularVelocity: Vector3;
  /** Simulation time in seconds. */
  simulationTime: number;
}

export interface RigidBodyOptions {
  objectId: string;
  type: RigidBodyType;
  position?: Vector3;
  rotation?: Quaternion;
  velocity?: Vector3;
  angularVelocity?: Vector3;
}

export interface ColliderOptions {
  objectId: string;
  bodyId: string;
  shape: ColliderShape;
  /** Cuboid half-extents in metres, or ball radius in metres. */
  dimensions: Vector3 | number;
  restitution?: number;
  friction?: number;
}

export interface PhysicsWorldOptions {
  /** Defaults to Earth gravity, 9.81 m/s² downward on Y. */
  gravity?: Vector3;
  /** Fixed duration of a simulation tick, in seconds. Defaults to 1/60. */
  fixedTimeStep?: number;
}

export const EARTH_GRAVITY: Vector3 = { x: 0, y: -9.81, z: 0 };
export const DEFAULT_FIXED_TIME_STEP = 1 / 60;
