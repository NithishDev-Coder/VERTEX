import Ajv from "ajv";
import { describe, expect, it } from "vitest";
import projectileMotionSchema from "../schemas/projectileMotion.schema.json";
import {
  projectileMotionExampleConfig,
  projectileMotionExperiment,
} from "../experiments/projectileMotion";
import { projectileMotionMeasurements } from "../measurements/measurementDefinitions";

describe("Projectile Motion foundation", () => {
  it("defines the expected experiment metadata and example", () => {
    expect(projectileMotionExperiment).toEqual({
      experiment: "projectile_motion",
      version: "1.0",
      ...projectileMotionExampleConfig,
    });
  });

  it("defines the expected measurements", () => {
    expect(projectileMotionMeasurements).toEqual([
      { id: "maximum_height", label: "Maximum Height", unit: "m" },
      { id: "maximum_range", label: "Maximum Range", unit: "m" },
      { id: "flight_time", label: "Flight Time", unit: "s" },
      { id: "maximum_velocity", label: "Maximum Velocity", unit: "m/s" },
    ]);
  });

  it("accepts a valid configuration with the versioned schema", () => {
    const validate = new Ajv().compile(projectileMotionSchema);

    expect(
      validate({
        experiment: "projectile_motion",
        version: "1.0",
        ...projectileMotionExampleConfig,
      }),
    ).toBe(true);
  });

  it("rejects an invalid configuration with the versioned schema", () => {
    const validate = new Ajv().compile(projectileMotionSchema);

    expect(
      validate({
        experiment: "projectile_motion",
        version: "1.0",
        ...projectileMotionExampleConfig,
        mass: 0,
      }),
    ).toBe(false);
  });
});
