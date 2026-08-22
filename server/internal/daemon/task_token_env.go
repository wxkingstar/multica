package daemon

import "log/slog"

// layerTaskTokens applies server-issued identity tokens onto the child env.
//
// Runs BEFORE layerCustomEnvAndHermesHome so an agent's custom_env can still
// override a token by name — the documented local-debugging path. The
// blocklist is re-checked here even though the server validates template env
// names, because this is the boundary that actually owns the child process
// environment.
func layerTaskTokens(agentEnv, taskTokens map[string]string, logger *slog.Logger) {
	for k, v := range taskTokens {
		if isBlockedEnvKey(k) {
			if logger != nil {
				logger.Warn("task token: blocked env key skipped", "key", k)
			}
			continue
		}
		agentEnv[k] = v
	}
}
