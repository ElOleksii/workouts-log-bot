import { formatDuration } from "../api/src/utils";

describe("formatDuration Utility", () => {
  test("correctly formats seconds into MM::SS string", () => {
    const input = 90;
    expect(formatDuration(input)).toBe("1m 30s");
  });
});
