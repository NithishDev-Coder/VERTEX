export interface ProjectileMotionConfig {
  mass: number;
  initialVelocity: number;
  launchAngle: number;
  gravity: number;
  initialHeight: number;
  airResistance: number;
}

export interface ProjectileMotionExperiment {
  experiment: "projectile_motion";
  version: "1.0";
  mass: number;
  initialVelocity: number;
  launchAngle: number;
  gravity: number;
  initialHeight: number;
  airResistance: number;
}

export interface ValidationError {
  field: keyof ProjectileMotionConfig;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

export interface MeasurementDefinition {
  id: string;
  label: string;
  unit: string;
}
