import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { I18nProvider } from "@multica/core/i18n/react";
import { configStore } from "@multica/core/config";
import enCommon from "../../locales/en/common.json";
import enOnboarding from "../../locales/en/onboarding.json";
import { CliInstallInstructions } from "./cli-install-instructions";

const TEST_RESOURCES = { en: { common: enCommon, onboarding: enOnboarding } };

function renderCard() {
  render(
    <I18nProvider locale="en" resources={TEST_RESOURCES}>
      <CliInstallInstructions />
    </I18nProvider>,
  );
}

describe("CliInstallInstructions", () => {
  afterEach(() => {
    configStore.getState().setDaemonConfig({});
  });

  // Wiring only — ./self-host-commands.test.ts owns the command matrix.
  // The bare `multica setup` configures Multica Cloud, so a self-hosted
  // deployment must not be handed it.
  it("uses the server's daemon endpoints when it declares them", () => {
    configStore.getState().setDaemonConfig({
      daemonServerUrl: "https://multica.example.com",
      daemonAppUrl: "https://multica.example.com",
    });

    renderCard();

    expect(
      screen.getByText(
        "multica setup self-host --server-url https://multica.example.com --app-url https://multica.example.com",
      ),
    ).toBeInTheDocument();
    expect(screen.queryByText("multica setup")).not.toBeInTheDocument();
  });
});
