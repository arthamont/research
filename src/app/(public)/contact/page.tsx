import type { Metadata } from "next";
import { MicroLabel } from "@/components/ui/primitives";
import { Reveal, RevealText } from "@/components/motion/reveal";
import { ContactForm } from "./contact-form";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Contact",
  description: "Reach Arthamont — questions, suggestions, and research inquiries.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 pb-24 pt-40 sm:px-8">
      <MicroLabel>Contact Us</MicroLabel>
      <RevealText>
        <h1 className="font-display mt-4 text-5xl font-semibold leading-[1.05] sm:text-6xl">
          Worth a<br />
          <span className="text-text-secondary">conversation.</span>
        </h1>
      </RevealText>
      <Reveal delay={0.15}>
        <p className="mt-10 max-w-xl text-lg leading-relaxed text-text-secondary">
          Questions, suggestions, research ideas, or observations worth sharing — write to us. Every message is read
          and answered personally.
        </p>
      </Reveal>
      <Reveal delay={0.25}>
        <div className="mt-12">
          <ContactForm />
        </div>
      </Reveal>
      <p className="mt-8 text-[11px] leading-relaxed text-text-faint">
        Arthamont does not solicit capital, provide investment advice, or manage client funds. Messages are used
        solely to respond to your inquiry.
      </p>
    </div>
  );
}
