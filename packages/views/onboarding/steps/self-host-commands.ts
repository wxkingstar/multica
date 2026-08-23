// A bare `multica setup` is the cloud path: server/cmd/multica/cmd_setup.go
// routes it to runSetupCloud, which writes the managed-cloud endpoints and
// prints "Configured for Multica Cloud". Handing that to someone signed in to
// a self-hosted deployment points their daemon at a different server, so the
// runtime never appears in the workspace they are looking at — and nothing in
// the CLI output says why.
//
// The endpoints the server actually wants daemons to use come down with GET
// /api/config (configStore.daemonServerUrl / daemonAppUrl), so build the
// explicit self-host form whenever both are present. Same rule, same fallback
// as runtimes/components/connect-remote-dialog.tsx: the managed cloud omits
// them, and there the bare command is correct because the CLI already knows
// those defaults.

function normalizeEndpoint(url: string | undefined): string {
  return url?.trim().replace(/\/+$/, "") ?? "";
}

export function setupCommand(
  daemonServerUrl: string | undefined,
  daemonAppUrl: string | undefined,
): string {
  const serverUrl = normalizeEndpoint(daemonServerUrl);
  const appUrl = normalizeEndpoint(daemonAppUrl);
  if (!serverUrl || !appUrl) return "multica setup";
  return `multica setup self-host --server-url ${serverUrl} --app-url ${appUrl}`;
}
