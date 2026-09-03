import type { MeasurementDefinition } from "../types/experiment";

export const projectileMotionMeasurements: readonly MeasurementDefinition[] = [
  { id: "maximum_height", label: "Maximum Height", unit: "m" },
  { id: "maximum_range", label: "Maximum Range", unit: "m" },
  { id: "flight_time", label: "Flight Time", unit: "s" },
  { id: "maximum_velocity", label: "Maximum Velocity", unit: "m/s" },
];
