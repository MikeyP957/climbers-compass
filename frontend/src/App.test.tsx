import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders learn react link", () => {
  render(<App />);
  const linkElement = screen.getByText(/Welcome to the Climber's Compass/i);
  expect(linkElement).toBeInTheDocument();
});