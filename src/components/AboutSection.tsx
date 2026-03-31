import { MapPin, Phone, Clock, Instagram } from "lucide-react";

export default function AboutSection() {
  return (
    <section id="about" className="py-24 px-4 bg-card">
      <div className="container mx-auto max-w-4xl">
        <p className="text-primary text-sm tracking-[0.3em] uppercase text-center mb-3">About Us</p>
        <h2 className="font-heading text-3xl md:text-4xl text-foreground text-center mb-12">Karl Salon</h2>

        <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-16 text-lg">
          Located in Alexandria, we bring together traditional barbering craftsmanship
          with modern grooming techniques. Every visit is an experience — from the hot towel to the final touch.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <MapPin className="h-8 w-8 text-primary mx-auto mb-4" />
            <h3 className="font-heading text-foreground mb-2">Location</h3>
            <a
              href="https://maps.app.goo.gl/SLAwcjqfJr5nXiFF6"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground text-sm hover:text-primary transition-colors"
            >
              Building 3, Al Naql w Handasa St<br />Alexandria Governorate 21648
            </a>
          </div>
          <div className="text-center">
            <Clock className="h-8 w-8 text-primary mx-auto mb-4" />
            <h3 className="font-heading text-foreground mb-2">Hours</h3>
            <p className="text-muted-foreground text-sm">Sat – Thu: 10AM – 10PM<br />Friday: 2PM – 10PM</p>
          </div>
          <div className="text-center">
            <Phone className="h-8 w-8 text-primary mx-auto mb-4" />
            <h3 className="font-heading text-foreground mb-2">Contact</h3>
            <a href="tel:+201030355625" className="text-muted-foreground text-sm hover:text-primary transition-colors">
              01030355625
            </a>
          </div>
          <div className="text-center">
            <Instagram className="h-8 w-8 text-primary mx-auto mb-4" />
            <h3 className="font-heading text-foreground mb-2">Follow Us</h3>
            <div className="flex flex-col gap-1">
              <a
                href="https://www.instagram.com/kral.saloon/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground text-sm hover:text-primary transition-colors"
              >
                Instagram
              </a>
              <a
                href="https://www.facebook.com/KRALSALON1"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground text-sm hover:text-primary transition-colors"
              >
                Facebook
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
