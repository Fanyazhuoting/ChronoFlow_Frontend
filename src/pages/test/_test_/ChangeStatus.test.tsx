import TestPage from "..";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
describe("Test Page", () => {
  test("renders correctly", () => {
    render(<TestPage />);
    expect(
      screen.getByRole("heading", { name: /test page/i })
    ).toBeInTheDocument();
  });

  test('renders "Test not changed" if the button was not clicked', () => {
    render(<TestPage />);
    expect(screen.getByText(/test not changed/i)).toBeInTheDocument();
  });

  test('renders "Change test" after click', async () => {
    render(<TestPage />);
    const user = userEvent.setup();
    await user.click(
      screen.getByRole("button", { name: /change test button/i })
    );
    expect(await screen.findByText(/^change test$/i)).toBeInTheDocument();
  });

  test('does NOT render "Test not changed" after click', async () => {
    render(<TestPage />);
    const user = userEvent.setup();
    await user.click(
      screen.getByRole("button", { name: /change test button/i })
    );
    expect(screen.queryByText(/test not changed/i)).toBeNull();
  });
});
