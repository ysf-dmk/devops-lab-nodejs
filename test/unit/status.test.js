/**
 * Unit tests for src/utils/status.js.
 * Covers all branches for good branch coverage.
 */
import { describe, it, expect } from "vitest";
import { formatStatus } from "../../src/utils/status.js";

describe("formatStatus", () => {
  it("throws an error for negative uptime", () => {
    expect(() => formatStatus(-1)).toThrow();
  });

  it("returns 'warming-up' below 60 seconds", () => {
    expect(formatStatus(0)).toBe("warming-up");
    expect(formatStatus(59)).toBe("warming-up");
  });

  it("returns 'healthy' from 60 through 3599 seconds", () => {
    expect(formatStatus(60)).toBe("healthy");
    expect(formatStatus(3599)).toBe("healthy");
  });

  it("returns 'steady' when uptime is 3600 or greater", () => {
    expect(formatStatus(3600)).toBe("steady");
  });
});