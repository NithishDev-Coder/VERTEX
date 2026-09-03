import { describe, expect, it } from "vitest";
import { projectileMotionExampleConfig } from "../experiments/projectileMotion";
import { validateProjectileMotionConfig } from "../validation/experimentValidator";

describe("validateProjectileMotionConfig", () => {
  it("passes a valid configuration", () => {
    expect(validateProjectileMotionConfig(projectileMotionExampleConfig)).toEqual({
      valid: true,
      errors: [],
    });
  });

  it.each([
    ["mass", { mass: 0 }],
    ["initialVelocity", { initialVelocity: -1 }],
    ["launchAngle", { launchAngle: 91 }],
    ["gravity", { gravity: -1 }],
    ["initialHeight", { initialHeight: -1 }],
    ["airResistance", { airResistance: -1 }],
  ] as const)("rejects invalid %s", (field, change) => {
    const result = validateProjectileMotionConfig({
      ...projectileMotionExampleConfig,
      ...change,
    });

    expect(result.valid).toBe(false);
    expect(result.errors.some((error) => error.field === field)).toBe(true);
  });
});
