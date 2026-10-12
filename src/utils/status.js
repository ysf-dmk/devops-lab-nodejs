/**
 * Utility designed to create branch coverage.
 * Maps uptime (seconds) to a label.
 */
export function formatStatus(uptime) {
  if (uptime < 0) {
    throw new Error("Uptime cannot be negative");
  }
  if (uptime < 60) {
    return "warming-up";
  }
  if (uptime < 3600) {
    return "healthy";
  }
  return "steady";
}