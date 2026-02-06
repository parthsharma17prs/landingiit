import BackgroundPaths from "@/components/ui/modern-background-paths";
import { Navbar } from "@/components/ui/navbar";
import { TimelineDemo } from "@/components/timeline-demo";
import { ZoomParallaxDemo } from "@/components/zoom-parallax-demo";
import { RevealImageListDemo } from "@/components/reveal-images-demo";
import { TestimonialsDemo } from "@/components/testimonials-demo";
import { FooterDemo } from "@/components/footer-demo";

export default function Home() {
  return (
    <main className="w-full relative overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="h-screen w-full relative">
        <BackgroundPaths />
      </section>

      {/* Timeline Section */}
      <section className="relative w-full bg-background">
        <TimelineDemo />
      </section>

      {/* Zoom Parallax Section */}
      <section className="relative w-full bg-background">
        <ZoomParallaxDemo />
      </section>

      {/* Reveal Images Section */}
      <section className="relative w-full bg-background flex justify-center py-20">
        <RevealImageListDemo />
      </section>

      {/* Testimonials Section */}
      <section className="relative w-full bg-background">
        <TestimonialsDemo />
      </section>

      {/* Footer Section */}
      <FooterDemo />
    </main >
  );
}
