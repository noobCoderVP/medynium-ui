import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SignInForm } from "./sign-in-form";

const signIn = vi.fn();
const verify = vi.fn();
const state = {
  resuming: false,
  message: null as string | null,
  challenge: null as null | { challenge: string; email_hint: string; expires_in_minutes: number },
};
vi.mock("../hooks/use-sign-in", () => ({
  useResumeSession: () => state.resuming,
  useSignIn: () => ({
    signIn,
    verify,
    challenge: state.challenge,
    cancel: vi.fn(),
    pending: false,
    message: state.message,
  }),
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

  it("asks for the emailed code after the password when the server wants one", async () => {
    state.challenge = {
      challenge: "c".repeat(30),
      email_hint: "s*****@demo.medynium",
      expires_in_minutes: 10,
    };
    render(<SignInForm next="/dashboard" />);
    expect(screen.getByText("s*****@demo.medynium")).toBeInTheDocument();
    const submit = screen.getByRole("button", { name: "Verify and sign in" });
    expect(submit).toBeDisabled();
    await userEvent.type(screen.getByLabelText("Sign-in code"), "12a3456");
    await userEvent.click(submit);
    expect(verify).toHaveBeenCalledWith("123456");
    state.challenge = null;
  });

  it("links to the password reset page", () => {
    render(<SignInForm next="/dashboard" />);
    expect(screen.getByRole("link", { name: "Forgot your password?" })).toHaveAttribute(
      "href",
      "/forgot-password",
    );
  });
});
