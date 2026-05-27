import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EmailField, __test } from "@/components/contact/email-field";

const { getSuggestion, POPULAR_DOMAINS } = __test;

describe("getSuggestion", () => {
  it("returns null when no @ is present", () => {
    expect(getSuggestion("jane")).toBeNull();
  });
  it("returns null when local part is empty", () => {
    expect(getSuggestion("@gmail")).toBeNull();
  });
  it("returns null when nothing typed after @", () => {
    expect(getSuggestion("jane@")).toBeNull();
  });
  it("suggests gmail.com after typing 'gm'", () => {
    expect(getSuggestion("jane@gm")).toBe("jane@gmail.com");
  });
  it("suggests google.com after typing 'goog'", () => {
    expect(getSuggestion("jane@goog")).toBe("jane@google.com");
  });
  it("returns null when typed domain has no match", () => {
    expect(getSuggestion("jane@zzzzzz")).toBeNull();
  });
  it("returns null when domain is already complete", () => {
    expect(getSuggestion("jane@gmail.com")).toBeNull();
  });
  it("is case-insensitive on the typed portion", () => {
    expect(getSuggestion("jane@GMA")).toBe("jane@gmail.com");
  });
  it("popular domain list contains common providers", () => {
    expect(POPULAR_DOMAINS).toEqual(
      expect.arrayContaining(["gmail.com", "outlook.com", "icloud.com"]),
    );
  });
});

describe("<EmailField />", () => {
  it("renders the label and input", () => {
    render(<EmailField required />);
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
  });

  it("shows a ghost suggestion as the user types", async () => {
    const user = userEvent.setup();
    render(<EmailField />);
    const input = screen.getByLabelText(/Email/i);
    await user.click(input);
    await user.type(input, "jane@gm");
    expect(screen.getByTestId("email-ghost")).toHaveTextContent("ail.com");
  });

  it("accepts the suggestion when Tab is pressed", async () => {
    const user = userEvent.setup();
    render(<EmailField />);
    const input = screen.getByLabelText(/Email/i) as HTMLInputElement;
    await user.click(input);
    await user.type(input, "jane@gm");
    await user.keyboard("{Tab}");
    expect(input.value).toBe("jane@gmail.com");
  });

  it("accepts the suggestion when ArrowRight is pressed at end", async () => {
    const user = userEvent.setup();
    render(<EmailField />);
    const input = screen.getByLabelText(/Email/i) as HTMLInputElement;
    await user.click(input);
    await user.type(input, "jane@out");
    await user.keyboard("{ArrowRight}");
    expect(input.value).toBe("jane@outlook.com");
  });

  it("renders an inline error when provided", () => {
    render(<EmailField error="Invalid email" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Invalid email");
  });

  it("does not show ghost when domain is already complete", async () => {
    const user = userEvent.setup();
    render(<EmailField />);
    const input = screen.getByLabelText(/Email/i);
    await user.click(input);
    await user.type(input, "jane@gmail.com");
    expect(screen.queryByTestId("email-ghost")).not.toBeInTheDocument();
  });
});
