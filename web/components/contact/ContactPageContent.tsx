'use client';

import {motion} from "framer-motion";
import {useTypoClass} from "@/components/TypographyProvider";
import {useLayoutEffect, useRef} from "react";
import type {ContactDocument} from "@/lib/types/project";
import {CONTACT_ICON_MAP} from "@/lib/contactIcons";

const VALUE_MAX_PX = {base: 18, md: 20};
const VALUE_MIN_PX = 11;

function SingleLineFitValue({text}: {text: string}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const line = lineRef.current;
    if (!wrap || !line) return;

    const fit = () => {
      const w = wrap.clientWidth;
      if (w <= 0) return;

      const isMd = window.matchMedia("(min-width: 768px)").matches;
      const maxPx = isMd ? VALUE_MAX_PX.md : VALUE_MAX_PX.base;
      let size = maxPx;
      line.style.fontSize = `${size}px`;
      while (line.scrollWidth > w && size > VALUE_MIN_PX) {
        size -= 0.35;
        line.style.fontSize = `${size}px`;
      }
    };

    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [text]);

  return (
    <div ref={wrapRef} className="w-full min-w-0 overflow-hidden">
      <p
        ref={lineRef}
        className="whitespace-nowrap font-medium leading-snug text-slate-950 transition-colors group-hover:text-slate-700"
        style={{fontSize: `${VALUE_MAX_PX.base}px`}}
      >
        {text}
      </p>
    </div>
  );
}

export function ContactPageContent({
  contact,
  variant = "page",
}: {
  contact: ContactDocument;
  variant?: "page" | "embedded";
}) {
  const displayClass = useTypoClass("display");
  const metaClass = useTypoClass("meta");
  const {headline, headlineEmphasis, channels, footnote} = contact;
  const hasHeadline = Boolean(headline?.trim()) || Boolean(headlineEmphasis?.trim());
  const isEmbedded = variant === "embedded";
  const Root = isEmbedded ? "div" : "main";
  const rootClassName = isEmbedded
    ? "mt-24 border-t border-slate-100 pt-20 md:mt-32 md:pt-28"
    : "container-wide py-20 md:py-40";

  return (
    <Root {...(isEmbedded ? {id: "contact"} : {})} className={rootClassName}>
      <div className="max-w-4xl">
        {hasHeadline ? (
          <motion.h1
            className={`text-5xl text-slate-950 sm:text-7xl ${displayClass}`}
            initial={{opacity: 0, y: 50}}
            whileInView={{opacity: 1, y: 0}}
            transition={{duration: 0.8}}
            viewport={{once: true}}
          >
            {headline?.trim() ? <>{headline}</> : null}
            {headline?.trim() && headlineEmphasis?.trim() ? <> </> : null}
            {headlineEmphasis?.trim() ? (
              <span className={`italic ${displayClass}`}>{headlineEmphasis}</span>
            ) : null}
          </motion.h1>
        ) : null}

        {channels && channels.length > 0 ? (
          <motion.div
            className="mt-20 grid gap-8 sm:grid-cols-2 xl:grid-cols-3"
            initial={{opacity: 0}}
            whileInView={{opacity: 1}}
            transition={{duration: 0.8, delay: 0.2}}
            viewport={{once: true}}
          >
            {channels.map((channel, index) => {
              const Icon = CONTACT_ICON_MAP[channel.icon];
              const isExternal = !channel.href.startsWith("mailto:") && !channel.href.startsWith("tel:");
              return (
                <motion.a
                  key={`${channel.label}-${index}`}
                  href={channel.href}
                  {...(isExternal ? {target: "_blank", rel: "noopener noreferrer"} : {})}
                  className="group relative flex min-w-0 flex-col gap-5 rounded-2xl border border-slate-200/60 bg-white/80 p-9 shadow-[0_10px_38px_-12px_rgba(15,23,42,0.14)] backdrop-blur-sm transition-all duration-500 ease-out hover:-translate-y-1.5 hover:border-slate-300/80 hover:shadow-[0_18px_48px_-14px_rgba(15,23,42,0.18)] md:p-10"
                  initial={{opacity: 0, y: 40, scale: 0.96}}
                  whileInView={{opacity: 1, y: 0, scale: 1}}
                  transition={{duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1]}}
                  viewport={{once: true}}
                >
                  <div className="flex items-center gap-3">
                    {Icon ? <Icon className="h-5 w-5 text-slate-400" /> : null}
                    <h2 className={`text-[11px] uppercase tracking-[0.22em] text-slate-400 ${metaClass}`}>
                      {channel.label}
                    </h2>
                  </div>
                  <div className="space-y-2">
                    <SingleLineFitValue text={channel.value} />
                    {channel.sub ? (
                      <p className="text-sm text-slate-400">{channel.sub}</p>
                    ) : null}
                  </div>
                </motion.a>
              );
            })}
          </motion.div>
        ) : null}

        {footnote ? (
          <motion.div
            className="mt-40 border-t border-slate-100 pt-12"
            initial={{opacity: 0, y: 50}}
            whileInView={{opacity: 1, y: 0}}
            transition={{duration: 0.8}}
            viewport={{once: true}}
          >
            <p className={`whitespace-pre-line text-slate-500 ${metaClass}`}>{footnote}</p>
          </motion.div>
        ) : null}
      </div>
    </Root>
  );
}
