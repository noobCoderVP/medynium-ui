import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SignInForm } from "./sign-in-form";

const signIn = vi.fn();
const state = { resuming: false, message: null as string | null };
vi.mock("../hooks/use-sign-in", () => ({
  useResumeSession: () => state.resuming,
  useSignIn: () => ({ signIn, pending: false, message: state.message }),
}));

describe("SignInForm", () => {
  it("asks for both fields before submitting", async () => {
    render(<SignInForm next="/dashboard" />);
    await userEvent.click(screen.getByRole("button", { name: "Sign in" }));
    expect(screen.getByText("Enter your email.")).toBeInTheDocument();
    expect(screen.getByText("Enter your password.")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toHaveAttribute("aria-invalid", "true");
    expect(signIn).not.toHaveBeenCalled();
  });

  it("submits the trimmed email and the password", async () => {
    render(<SignInForm next="/dashboard" />);
    await userEvent.type(screen.getByLabelText("Email"), " sharma@demo.medynium ");
    await userEvent.type(screen.getByLabelText("Password"), "a-long-password");
    await userEvent.click(screen.getByRole("button", { name: "Sign in" }));
    expect(signIn).toHaveBeenCalledWith({
      email: "sharma@demo.medynium",
      password: "a-long-password",
    });
  });

  it("shows the server outcome as an alert", () => {
    state.message = "That email and password don't match. Check them and try again.";
    render(<SignInForm next="/dashboard" />);
    expect(screen.getByRole("alert")).toHaveTextContent(/don't match/);
    state.message = null;
  });

  it("shows a status instead of the form while resuming an existing session", () => {
    state.resuming = true;
    render(<SignInForm next="/dashboard" />);
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.queryByLabelText("Email")).not.toBeInTheDocument();
    state.resuming = false;
  });
});
