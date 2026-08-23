// @vitest-environment node
import { describe, expect, it } from "vitest";
import { setupCommand } from "./self-host-commands";

describe("setupCommand", () => {
  it("emits the self-host form when the server declares its endpoints", () => {
    expect(
      setupCommand("https://multica.example.com", "https://multica.example.com"),
    ).toBe(
      "multica setup self-host --server-url https://multica.example.com --app-url https://multica.example.com",
    );
  });

  it("trims trailing slashes so the command reads like the docs", () => {
    expect(setupCommand("https://api.example.com/", "https://app.example.com//")).toBe(
      "multica setup self-host --server-url https://api.example.com --app-url https://app.example.com",
    );
  });

  it("falls back to the bare command on the managed cloud, which omits them", () => {
    expect(setupCommand("", "")).toBe("multica setup");
    expect(setupCommand(undefined, undefined)).toBe("multica setup");
  });

  it("never emits a half-configured command", () => {
    expect(setupCommand("https://api.example.com", "")).toBe("multica setup");
    expect(setupCommand("  ", "https://app.example.com")).toBe("multica setup");
  });
});
