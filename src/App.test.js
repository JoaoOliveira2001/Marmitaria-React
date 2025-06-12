import { render } from "@testing-library/react";
import React from "react";

// Mock react-router-dom to avoid issues with ESM during tests
jest.mock(
  "react-router-dom",
  () => ({
    HashRouter: ({ children }) => <div>{children}</div>,
    Routes: ({ children }) => <div>{children}</div>,
    Route: ({ element }) => element,
    useNavigate: () => jest.fn(),
  }),
  { virtual: true },
);

import App from "./App";

test("renders without crashing", () => {
  render(<App />);
});
