import { MapPin, Phone, Clock } from "lucide-react";

export default function AboutSection() {
  return (
    <section id="about" className="py-24 px-4 bg-card">
      <div className="container mx-auto max-w-4xl">
        <p className="text-primary text-sm tracking-[0.3em] uppercase text-center mb-3">About Us</p>
        <h2 className="font-heading text-3xl md:text-4xl text-foreground text-center mb-12">Alexandria Cuts</h2>

        <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-16 text-lg">
          Located in the heart of Alexandria, we bring together traditional barbering craftsmanship
          with modern grooming techniques. Every visit is an experience — from the hot towel to the final touch.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <MapPin className="h-8 w-8 text-primary mx-auto mb-4" />
            <h3 className="font-heading text-foreground mb-2">Location</h3>
            <p className="text-muted-foreground text-sm">Downtown Alexandria<br />Stanley, Egypt</p>
          </div>
          <div className="text-center">
            <Clock className="h-8 w-8 text-primary mx-auto mb-4" />
            <h3 className="font-heading text-foreground mb-2">Hours</h3>
            <p className="text-muted-foreground text-sm">Sat – Thu: 10AM – 10PM<br />Friday: 2PM – 10PM</p>
          </div>
          <div className="text-center">
            <Phone className="h-8 w-8 text-primary mx-auto mb-4" />
            <h3 className="font-heading text-foreground mb-2">Contact</h3>
            <p className="text-muted-foreground text-sm">+20 3 123 4567<br />info@alexandriacuts.com</p>
          </div>
        </div>
      </div>
    </section>
  );
}
