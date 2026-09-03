import type {
  ProjectileMotionConfig,
  ProjectileMotionExperiment,
} from "../types/experiment";

export const projectileMotionExampleConfig: ProjectileMotionConfig = {
  mass: 2,
  initialVelocity: 20,
  launchAngle: 45,
  gravity: 9.81,
  initialHeight: 0,
  airResistance: 0,
};

export const projectileMotionExperiment: ProjectileMotionExperiment = {
  experiment: "projectile_motion",
  version: "1.0",
  ...projectileMotionExampleConfig,
};
