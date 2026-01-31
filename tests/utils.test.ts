import { formatDuration } from "../api/src/utils/utils";

describe("formatDuration Utility", () => {
  describe("Seconds handling", () => {
    test("returns singular 'second' for 1", () => {
      expect(formatDuration(1)).toBe("1 second");
    });

    test("returns plural 'seconds' for number other than 1", () => {
      expect(formatDuration(0)).toBe("0 seconds");
      expect(formatDuration(5)).toBe("5 seconds");
      expect(formatDuration(59)).toBe("59 seconds");
    });
  });

  describe("Minutes handling", () => {
    test("returns singular 'minute' for 1", () => {
      expect(formatDuration(60)).toBe("1 minute");
    });

    test("returns plural 'minutes' for number other than 1", () => {
      expect(formatDuration(120)).toBe("2 minutes");
    });

    test("ignore remaining seconds (rounds down)", () => {
      expect(formatDuration(65)).toBe("1 minute");
      expect(formatDuration(119)).toBe("1 minute");
    });

    test("formats upper bondary correctly", () => {
      expect(formatDuration(59 * 60)).toBe("59 minutes");
    });
  });

  describe("Hours handling", () => {
    test("returns singular 'hour' for 1", () => {
      expect(formatDuration(3600)).toBe("1 hour");
    });

    test("returns plural 'hours' for other than 1", () => {
      expect(formatDuration(3600 * 2)).toBe("2 hours");
    });

    test("hours + minutes", () => {
      const seconds = 3600 + 1800; // 1.5 hour
      expect(formatDuration(seconds)).toBe("1 hour 30 minutes");
      expect(formatDuration(seconds + 1200)).toBe("1 hour 50 minutes");
    });
  });

  describe("Outrange values", () => {
    test("value less than zero (must generate an error)", () => {
      expect(() => {
        formatDuration(-1);
      }).toThrow();
    });
  });
});
