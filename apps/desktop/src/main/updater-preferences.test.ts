// @vitest-environment node
import { afterEach, describe, expect, it } from "vitest";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  loadUpdaterPreferences,
  saveUpdaterPreferences,
  updaterPreferencesPath,
  DEFAULT_UPDATER_PREFERENCES,
} from "./updater-preferences";

const tempDirs: string[] = [];

async function makePreferencesPath(): Promise<string> {
  const dir = await mkdtemp(join(tmpdir(), "multica-updater-preferences-"));
  tempDirs.push(dir);
  return updaterPreferencesPath(dir);
}

afterEach(async () => {
  await Promise.all(
    tempDirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true })),
  );
});

describe("updater preferences", () => {
  // Asserts the fallback path — missing or malformed file falls back to the
  // build's default — not what that default is. A build that ships with
  // automatic updates off (one pointed at a feed it must not follow, say) is
  // a supported configuration, and pinning the literal here would make this
  // the test that breaks for it.
  it("falls back to the build's default when the file is missing or invalid", async () => {
    const missingPath = await makePreferencesPath();
    const invalidPath = await makePreferencesPath();
    await writeFile(invalidPath, JSON.stringify({ automaticUpdates: "false" }));

    await expect(loadUpdaterPreferences(missingPath)).resolves.toEqual({
      ...DEFAULT_UPDATER_PREFERENCES,
    });
    await expect(loadUpdaterPreferences(invalidPath)).resolves.toEqual({
      ...DEFAULT_UPDATER_PREFERENCES,
    });
  });

  it("round-trips a disabled automatic update preference", async () => {
    const filePath = await makePreferencesPath();

    await saveUpdaterPreferences(filePath, { automaticUpdates: false });

    await expect(loadUpdaterPreferences(filePath)).resolves.toEqual({
      automaticUpdates: false,
    });
    expect(JSON.parse(await readFile(filePath, "utf-8"))).toEqual({
      automaticUpdates: false,
    });
  });
});
