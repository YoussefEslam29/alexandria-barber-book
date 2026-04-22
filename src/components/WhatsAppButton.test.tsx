import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import WhatsAppButton from "./WhatsAppButton";

describe("WhatsAppButton", () => {
  it("renders the WhatsApp button", () => {
    render(<WhatsAppButton />);
    const linkElement = screen.getByLabelText("Chat on WhatsApp");
    expect(linkElement).toBeInTheDocument();
    expect(linkElement.tagName).toBe("A");
  });

  it("has correct WhatsApp link with pre-filled message", () => {
    render(<WhatsAppButton />);
    const linkElement = screen.getByLabelText("Chat on WhatsApp") as HTMLAnchorElement;
    expect(linkElement.href).toContain("https://wa.me/201030355625");
    expect(linkElement.href).toContain(encodeURIComponent("Hello Kral Salon, I would like to inquire about a grooming appointment."));
    expect(linkElement.target).toBe("_blank");
    expect(linkElement.rel).toBe("noopener noreferrer");
  });
});
