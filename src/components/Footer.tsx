import { Scissors } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border py-12 px-4">
      <div className="container mx-auto max-w-4xl text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Scissors className="h-5 w-5 text-primary" />
          <span className="font-heading text-lg text-foreground">Alexandria Cuts</span>
        </div>
        <p className="text-muted-foreground text-sm">
          Premium barbershop in Alexandria, Egypt. © {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
