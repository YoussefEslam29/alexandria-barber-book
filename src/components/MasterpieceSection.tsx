import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ExternalLink, Instagram } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

interface GalleryItem {
  id: string;
  image_url: string;
  caption: string | null;
  source_link: string | null;
  created_at: string;
}

const FALLBACK_GALLERY: GalleryItem[] = [
  {
    id: "1",
    image_url: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=600&auto=format&fit=crop",
    caption: "Clean fade 🔥",
    source_link: "https://www.instagram.com/kral.saloon/",
    created_at: "",
  },
  {
    id: "2",
    image_url: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=600&auto=format&fit=crop",
    caption: "Signature taper",
    source_link: "https://www.instagram.com/kral.saloon/",
    created_at: "",
  },
  {
    id: "3",
    image_url: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?q=80&w=600&auto=format&fit=crop",
    caption: "Full package ✂️",
    source_link: "https://www.instagram.com/kral.saloon/",
    created_at: "",
  },
  {
    id: "4",
    image_url: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=600&auto=format&fit=crop",
    caption: "The ritual",
    source_link: "https://www.instagram.com/kral.saloon/",
    created_at: "",
  },
  {
    id: "5",
    image_url: "https://images.unsplash.com/photo-1493256338651-d82f7acb2b38?q=80&w=600&auto=format&fit=crop",
    caption: "Precision at work",
    source_link: "https://www.instagram.com/kral.saloon/",
    created_at: "",
  },
  {
    id: "6",
    image_url: "https://images.unsplash.com/photo-1567894340315-735d7c361db0?q=80&w=600&auto=format&fit=crop",
    caption: "Beard sculpted 🗡️",
    source_link: "https://www.instagram.com/kral.saloon/",
    created_at: "",
  },
];

async function getGallery(): Promise<GalleryItem[]> {
  try {
    const { data, error } = await supabase
      .from("gallery" as any)
      .select("*")
      .order("created_at", { ascending: false });
    if (error || !data) return FALLBACK_GALLERY;
    return (data as GalleryItem[]).length > 0 ? (data as GalleryItem[]) : FALLBACK_GALLERY;
  } catch {
    return FALLBACK_GALLERY;
  }
}

export default function MasterpieceSection() {
  const { t } = useLanguage();
  const { data: gallery = FALLBACK_GALLERY } = useQuery({
    queryKey: ["gallery"],
    queryFn: getGallery,
  });

  return (
    <section id="masterpiece" className="py-32 px-4 bg-surface border-t border-surface-container">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <p className="text-primary font-label text-sm tracking-[0.3em] uppercase mb-3">{t("recentWork")}</p>
            <h2 className="font-heading text-4xl md:text-5xl text-foreground tracking-tight">
              Master<span className="text-primary italic">piece</span>
            </h2>
          </div>
          <a
            href="https://www.instagram.com/kral.saloon/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-muted-foreground hover:text-primary font-label text-sm tracking-widest uppercase transition-colors"
          >
            <Instagram className="h-4 w-4" />
            @kral.saloon
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {gallery.map((item, i) => (
            <a
              key={item.id}
              href={item.source_link || "https://www.instagram.com/kral.saloon/"}
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative overflow-hidden rounded-md bg-surface-container-low ghost-border ${
                i === 0 ? "md:col-span-2 md:row-span-2" : ""
              }`}
              style={{ aspectRatio: i === 0 ? "auto" : "1 / 1" }}
            >
              <img
                src={item.image_url}
                alt={item.caption || "Kral Salon work"}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                style={{ minHeight: i === 0 ? "400px" : "auto" }}
              />
              <div className="absolute inset-0 bg-surface/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <div className="flex items-center justify-between w-full">
                  <p className="text-foreground font-label text-sm">{item.caption}</p>
                  <ExternalLink className="h-4 w-4 text-primary shrink-0" />
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-10 text-center">
          <a
            href="https://www.instagram.com/kral.saloon/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-label text-sm text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest"
          >
            <Instagram className="h-4 w-4" />
            {t("viewMoreOnInstagram")}
          </a>
        </div>
      </div>
    </section>
  );
}
