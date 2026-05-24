'use client';

import Image from "next/image";
import {PortableText, type PortableTextComponents} from "@portabletext/react";
import {motion} from "framer-motion";
import {useTypoClass} from "@/components/TypographyProvider";
import {ContactPageContent} from "@/components/contact/ContactPageContent";
import {urlForImage} from "@/lib/sanity/image";
import type {AboutDocument, ContactDocument} from "@/lib/types/project";

const bioComponents: PortableTextComponents = {
  block: {
    normal: ({children}) => <p>{children}</p>,
  },
};

function contactHasRenderableContent(c: ContactDocument) {
  return (
    Boolean(c.headline?.trim()) ||
    Boolean(c.headlineEmphasis?.trim()) ||
    Boolean(c.channels?.length) ||
    Boolean(c.footnote?.trim())
  );
}

export function AboutPageContent({
  about,
  contact,
}: {
  about: AboutDocument;
  contact?: ContactDocument | null;
}) {
  const displayClass = useTypoClass("display");
  const bodyClass = useTypoClass("body");
  const metaClass = useTypoClass("meta");
  const headingClass = useTypoClass("heading");

  const {name, role, meta, portrait, bio, education, skillGroups, resumeUrl, resumeFilename} = about;

  const portraitSrc = portrait?.asset?._ref
    ? urlForImage(portrait).width(900).height(1125).fit("crop").quality(90).url()
    : null;

  return (
    <div className="container-wide mx-auto w-full max-w-[1400px] px-8 md:px-16 lg:px-24 py-20 md:py-32">
      <div className="grid gap-16 lg:grid-cols-[1fr_1.5fr]">
        <motion.section
          className="-mt-20 md:-mt-32"
          initial={{opacity: 0, x: -50}}
          whileInView={{opacity: 1, x: 0}}
          transition={{duration: 0.8}}
          viewport={{once: true}}
        >
          <div className="sticky top-32">
            {portraitSrc ? (
              <motion.div
                className="mb-6 w-full max-w-xs"
                initial={{opacity: 0, y: 30}}
                whileInView={{opacity: 1, y: 0}}
                transition={{duration: 0.8, delay: 0.1}}
                viewport={{once: true}}
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-slate-100">
                  <Image
                    src={portraitSrc}
                    alt={portrait?.alt ?? name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 70vw, 320px"
                  />
                </div>
              </motion.div>
            ) : null}

            <motion.h1
              className={`display-name-tone text-5xl sm:text-6xl ${displayClass}`}
              initial={{opacity: 0, y: 30}}
              whileInView={{opacity: 1, y: 0}}
              transition={{duration: 0.8, delay: 0.2}}
              viewport={{once: true}}
            >
              {name}
            </motion.h1>
            {role ? (
              <motion.p
                className={`mt-4 text-xl text-slate-600 ${bodyClass}`}
                initial={{opacity: 0, y: 30}}
                whileInView={{opacity: 1, y: 0}}
                transition={{duration: 0.8, delay: 0.4}}
                viewport={{once: true}}
              >
                {role}
              </motion.p>
            ) : null}

            {meta && meta.length > 0 ? (
              <motion.div
                className={`mt-8 space-y-4 text-sm uppercase tracking-[0.2em] text-slate-400 ${metaClass}`}
                initial={{opacity: 0, y: 30}}
                whileInView={{opacity: 1, y: 0}}
                transition={{duration: 0.8, delay: 0.6}}
                viewport={{once: true}}
              >
                {meta.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </motion.div>
            ) : null}
          </div>
        </motion.section>

        <section className="space-y-24 lg:-mt-6">
          {bio && bio.length > 0 ? (
            <motion.div
              className="max-w-2xl space-y-8"
              initial={{opacity: 0, y: 50}}
              whileInView={{opacity: 1, y: 0}}
              transition={{duration: 0.8}}
              viewport={{once: true}}
            >
              <h2 className={`text-sm uppercase tracking-[0.2em] text-slate-400 ${metaClass}`}>Biography</h2>
              <div className={`space-y-6 text-lg leading-relaxed text-slate-600 md:text-xl ${bodyClass}`}>
                <PortableText value={bio} components={bioComponents} />
              </div>
            </motion.div>
          ) : null}

          {education && education.length > 0 ? (
            <motion.div
              className="space-y-8"
              initial={{opacity: 0, y: 50}}
              whileInView={{opacity: 1, y: 0}}
              transition={{duration: 0.8}}
              viewport={{once: true}}
            >
              <h2 className={`text-sm uppercase tracking-[0.2em] text-slate-400 ${metaClass}`}>Education</h2>
              <div className="space-y-6">
                {education.map((item, i) => (
                  <div key={i}>
                    <div className="flex items-baseline justify-between">
                      <h3 className={`text-xl text-slate-950 ${headingClass}`}>
                        {item.school}
                      </h3>
                      {item.period ? (
                        <span className="text-sm text-slate-400">{item.period}</span>
                      ) : null}
                    </div>
                    {item.degree ? (
                      <p className="mt-1 text-slate-500">{item.degree}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            </motion.div>
          ) : null}

          {skillGroups && skillGroups.length > 0 ? (
            <motion.div
              className="space-y-8"
              initial={{opacity: 0, y: 50}}
              whileInView={{opacity: 1, y: 0}}
              transition={{duration: 0.8}}
              viewport={{once: true}}
            >
              <h2 className={`text-sm uppercase tracking-[0.2em] text-slate-400 ${metaClass}`}>Skills</h2>
              <div className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-3">
                {skillGroups.map((group, i) => (
                  <div key={i}>
                    <h4 className={`mb-4 text-slate-950 ${headingClass}`}>{group.title}</h4>
                    {group.items && group.items.length > 0 ? (
                      <ul className="space-y-2 text-sm text-slate-500">
                        {group.items.map((item, j) => (
                          <li key={j}>{item}</li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                ))}
              </div>
            </motion.div>
          ) : null}

          {resumeUrl ? (
            <motion.div
              className="pt-12"
              initial={{opacity: 1, y: 0}}
              whileInView={{opacity: 1, y: 0}}
              transition={{duration: 0.8}}
              viewport={{once: true, amount: 0.2}}
            >
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                download={resumeFilename ?? undefined}
                className="inline-flex items-center gap-2 border-b border-slate-950 pb-1 text-sm font-medium transition-colors hover:text-slate-500 hover:border-slate-500"
              >
                Download Full Resume (PDF)
              </a>
            </motion.div>
          ) : null}
        </section>
      </div>

      {contact && contactHasRenderableContent(contact) ? (
        <ContactPageContent contact={contact} variant="embedded" />
      ) : null}
    </div>
  );
}
