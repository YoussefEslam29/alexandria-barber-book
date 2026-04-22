import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LanguageProvider, useLanguage } from "./LanguageContext";

// Test component that uses the context
const TestComponent = () => {
  const { lang, setLang, t } = useLanguage();
  return (
    <div>
      <div data-testid="lang-display">{lang}</div>
      <div data-testid="translation-display">{t("services")}</div>
      <button onClick={() => setLang("ar")}>Set Arabic</button>
      <button onClick={() => setLang("en")}>Set English</button>
    </div>
  );
};

describe("LanguageContext", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("provides default English language and translates correctly", () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );

    expect(screen.getByTestId("lang-display")).toHaveTextContent("en");
    expect(screen.getByTestId("translation-display")).toHaveTextContent("Our Services");
  });

  it("updates language and translations when setLang is called", async () => {
    const user = userEvent.setup();
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );

    // Initial state
    expect(screen.getByTestId("lang-display")).toHaveTextContent("en");

    // Click to set Arabic
    await user.click(screen.getByText("Set Arabic"));

    // Check state update
    expect(screen.getByTestId("lang-display")).toHaveTextContent("ar");
    expect(screen.getByTestId("translation-display")).toHaveTextContent("خدمتنا");
    expect(localStorage.getItem("lang")).toBe("ar");
    expect(document.documentElement.dir).toBe("rtl");
  });

  it("loads language from localStorage if available", () => {
    localStorage.setItem("lang", "ar");
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );

    expect(screen.getByTestId("lang-display")).toHaveTextContent("ar");
    expect(screen.getByTestId("translation-display")).toHaveTextContent("خدمتنا");
    expect(document.documentElement.dir).toBe("rtl");
  });
});
