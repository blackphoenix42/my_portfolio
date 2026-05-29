import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import { PhoneField } from "@/components/contact/phone-field";

const messages = {
  contact: {
    form: {
      phoneCountry: "Country code",
      phoneSearch: "Search countries",
      phoneNoResults: "No matches",
      phonePlaceholder: "55 123 4567",
      errors: { phoneInvalid: "Please enter a valid phone number." },
    },
  },
};

function renderField(props: Partial<React.ComponentProps<typeof PhoneField>> = {}) {
  return render(
    <NextIntlClientProvider locale="en" messages={messages} timeZone="UTC">
      <PhoneField label="Phone" {...props} />
    </NextIntlClientProvider>,
  );
}

function getHiddenPhone(container: HTMLElement): HTMLInputElement {
  return container.querySelector('input[type="hidden"][name="phone"]') as HTMLInputElement;
}

describe("<PhoneField />", () => {
  it("defaults to India (+91) and renders an empty hidden value", () => {
    const { container } = renderField();
    expect(screen.getByRole("button", { name: /country code/i })).toHaveTextContent("+91");
    expect(getHiddenPhone(container).value).toBe("");
  });

  it("submits an E.164 value combining dial code + national digits", async () => {
    const user = userEvent.setup();
    const { container } = renderField();
    const input = screen.getByPlaceholderText("55 123 4567");
    await user.type(input, "9876543210");
    expect(getHiddenPhone(container).value).toBe("+919876543210");
  });

  it("strips non-digit characters from typed input", async () => {
    const user = userEvent.setup();
    const { container } = renderField();
    const input = screen.getByPlaceholderText("55 123 4567");
    await user.type(input, "98-76 54 32 10");
    expect((input as HTMLInputElement).value).toBe("9876543210");
    expect(getHiddenPhone(container).value).toBe("+919876543210");
  });

  it("opens the country dropdown and switches the selected country", async () => {
    const user = userEvent.setup();
    renderField();
    await user.click(screen.getByRole("button", { name: /country code/i }));
    const listbox = screen.getByRole("listbox");
    const us = within(listbox).getByText("United States");
    await user.click(us);
    expect(screen.getByRole("button", { name: /country code/i })).toHaveTextContent("+1");
  });

  it("filters countries by search query", async () => {
    const user = userEvent.setup();
    renderField();
    await user.click(screen.getByRole("button", { name: /country code/i }));
    const search = screen.getByPlaceholderText("Search countries");
    await user.type(search, "Japan");
    const listbox = screen.getByRole("listbox");
    expect(within(listbox).getByText("Japan")).toBeInTheDocument();
    expect(within(listbox).queryByText("India")).toBeNull();
  });

  it("filters by dial code", async () => {
    const user = userEvent.setup();
    renderField();
    await user.click(screen.getByRole("button", { name: /country code/i }));
    const search = screen.getByPlaceholderText("Search countries");
    await user.type(search, "+44");
    const listbox = screen.getByRole("listbox");
    expect(within(listbox).getByText("United Kingdom")).toBeInTheDocument();
  });

  it("shows a 'no results' message when nothing matches", async () => {
    const user = userEvent.setup();
    renderField();
    await user.click(screen.getByRole("button", { name: /country code/i }));
    await user.type(screen.getByPlaceholderText("Search countries"), "zzzzzz");
    expect(screen.getByText("No matches")).toBeInTheDocument();
  });

  it("flags numbers that do not meet the country's expected length on blur", async () => {
    const user = userEvent.setup();
    renderField();
    const input = screen.getByPlaceholderText("55 123 4567");
    await user.type(input, "123"); // India expects 10 digits
    await user.tab();
    expect(screen.getByRole("alert")).toHaveTextContent(/valid phone number/i);
  });

  it("prefers an externally supplied error message", () => {
    renderField({ error: "External boom" });
    expect(screen.getByRole("alert")).toHaveTextContent("External boom");
  });
});
