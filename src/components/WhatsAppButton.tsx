import { MessageCircle } from "lucide-react";

const WA_NUMBER = "201030355625";
const WA_MESSAGE = encodeURIComponent(
  "Hello Kral Salon! I just submitted a booking request and would like to confirm my appointment. Please let me know the next steps. Thank you! 🙏"
);

export default function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#00dbe7] hover:bg-[#00929a] text-white rounded-full p-4 shadow-lg shadow-[#00dbe7]/30 transition-all hover:scale-110 hover:shadow-[#00dbe7]/50 group flex items-center gap-0 hover:gap-2 overflow-hidden hover:rounded-full"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="h-6 w-6 shrink-0" />
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 text-sm font-label font-semibold whitespace-nowrap">
        &nbsp;Chat with us
      </span>
    </a>
  );
}

