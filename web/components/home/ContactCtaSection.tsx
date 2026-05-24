"use client";

import {motion} from "framer-motion";
import {useTypoClass} from "@/components/TypographyProvider";

export function ContactCtaSection({
  heading,
  email,
  links,
}: {
  heading?: string | null;
  email?: string | null;
  links?: {label: string; href: string}[] | null;
}) {
  const displayClass = useTypoClass("display");
  const metaClass = useTypoClass("meta");
  const mailto = email ? `mailto:${email}` : null;

  return (
    <motion.section
      className="mt-40 border-t border-slate-100 py-12"
      initial={{opacity: 0, y: 50}}
      whileInView={{opacity: 1, y: 0}}
      transition={{duration: 0.8}}
      viewport={{once: true}}
    >
      <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          {heading ? (
            <h2 className={`text-4xl leading-tight sm:text-5xl ${displayClass}`}>
              {heading}
            </h2>
          ) : null}
          {mailto ? (
            <a
              href={mailto}
              className="mt-6 block text-lg text-slate-600 underline decoration-slate-300 underline-offset-4 transition-colors hover:text-slate-500"
            >
              {email}
            </a>
          ) : null}
        </div>

        {links?.length ? (
          <div className={`flex flex-wrap gap-x-8 gap-y-3 text-sm uppercase tracking-[0.2em] text-slate-400 ${metaClass}`}>
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-slate-500"
              >
                {l.label}
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </motion.section>
  );
}
