import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { Provider } from "@rollbar/react";
import rollbarConfig from "shared/config/rollbar";

function ProviderWrapper({ children }: { children: React.ReactNode }) {
  return <Provider config={rollbarConfig}>{children}</Provider>;
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) => render(ui, { wrapper: ProviderWrapper, ...options });

export * from "@testing-library/react";
export { customRender as renderWithProvider };
