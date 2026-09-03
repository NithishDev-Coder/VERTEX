import type {
  ProjectileMotionConfig,
  ValidationError,
  ValidationResult,
} from "../types/experiment";

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

export const validateProjectileMotionConfig = (
  config: unknown,
): ValidationResult => {
  const errors: ValidationError[] = [];

  if (typeof config !== "object" || config === null) {
    return {
      valid: false,
      errors: [
        {
          field: "mass",
          message: "Configuration must be an object.",
        },
      ],
    };
  }

  const candidate = config as Partial<Record<keyof ProjectileMotionConfig, unknown>>;

  if (!isFiniteNumber(candidate.mass) || candidate.mass <= 0) {
    errors.push({ field: "mass", message: "Mass must be greater than 0." });
  }
  if (!isFiniteNumber(candidate.initialVelocity) || candidate.initialVelocity < 0) {
    errors.push({
      field: "initialVelocity",
      message: "Initial velocity must be greater than or equal to 0.",
    });
  }
  if (!isFiniteNumber(candidate.launchAngle) || candidate.launchAngle < 0) {
    errors.push({
      field: "launchAngle",
      message: "Launch angle must be greater than or equal to 0.",
    });
  } else if (candidate.launchAngle > 90) {
    errors.push({
      field: "launchAngle",
      message: "Launch angle must be less than or equal to 90.",
    });
  }
  if (!isFiniteNumber(candidate.gravity) || candidate.gravity <= 0) {
    errors.push({ field: "gravity", message: "Gravity must be greater than 0." });
  }
  if (!isFiniteNumber(candidate.initialHeight) || candidate.initialHeight < 0) {
    errors.push({
      field: "initialHeight",
      message: "Initial height must be greater than or equal to 0.",
    });
  }
  if (!isFiniteNumber(candidate.airResistance) || candidate.airResistance < 0) {
    errors.push({
      field: "airResistance",
      message: "Air resistance must be greater than or equal to 0.",
    });
  }

  return { valid: errors.length === 0, errors };
};
