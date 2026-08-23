type RuntimeEnv = Record<string, string | undefined>;

// A self-hosted deployment ships its own client builds, but the bundled
// /download page resolves every asset from the upstream releases API
// (features/landing/utils/github-release.ts). Left alone it therefore hands
// visitors the upstream installers — which default to the managed cloud —
// while the operator's own builds sit somewhere else entirely.
//
// Point DOWNLOAD_REDIRECT_URL at wherever those builds are published and the
// three entry points that reach this page (landing hero, login page, and the
// in-app Help menu, which links `/download` relative) all land there instead.
//
// Resolved from process.env at request time in proxy.ts rather than through
// next.config's redirects(): that hook runs during `next build`, so a
// prebuilt image could never be configured by its deployment. Unset — the
// default, including the managed cloud — keeps the bundled page.
const DOWNLOAD_PATHS = new Set(["/download", "/download/"]);

export function downloadRedirectDestination(
  pathname: string,
  env: RuntimeEnv,
): string | undefined {
  if (!DOWNLOAD_PATHS.has(pathname)) return undefined;

  const raw = env.DOWNLOAD_REDIRECT_URL?.trim();
  if (!raw) return undefined;

  // Absolute http(s) only. A relative value resolves back into this app and,
  // for a rule keyed on /download, would redirect to itself forever.
  try {
    const url = new URL(raw);
    if (url.protocol !== "http:" && url.protocol !== "https:") return undefined;
    return url.toString();
  } catch {
    return undefined;
  }
}
