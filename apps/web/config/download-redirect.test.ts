// @vitest-environment node
import { describe, expect, it } from "vitest";
import { downloadRedirectDestination } from "./download-redirect";

const TARGET = "https://docs.example.com/multica/install";

describe("downloadRedirectDestination", () => {
  it("redirects /download when the deployment configures a target", () => {
    expect(
      downloadRedirectDestination("/download", {
        DOWNLOAD_REDIRECT_URL: TARGET,
      }),
    ).toBe(TARGET);
  });

  it("treats the trailing-slash form as the same page", () => {
    expect(
      downloadRedirectDestination("/download/", {
        DOWNLOAD_REDIRECT_URL: TARGET,
      }),
    ).toBe(TARGET);
  });

  it("keeps the bundled page when unset — the managed-cloud default", () => {
    expect(downloadRedirectDestination("/download", {})).toBeUndefined();
    expect(
      downloadRedirectDestination("/download", { DOWNLOAD_REDIRECT_URL: "  " }),
    ).toBeUndefined();
  });

  it("leaves every other route alone", () => {
    for (const pathname of ["/", "/login", "/downloads", "/download/mac"]) {
      expect(
        downloadRedirectDestination(pathname, {
          DOWNLOAD_REDIRECT_URL: TARGET,
        }),
      ).toBeUndefined();
    }
  });

  it("ignores values that would redirect the page to itself", () => {
    for (const raw of ["/download", "download", "javascript:alert(1)", "::"]) {
      expect(
        downloadRedirectDestination("/download", {
          DOWNLOAD_REDIRECT_URL: raw,
        }),
      ).toBeUndefined();
    }
  });
});
