"use client";

const WELCOME_GRADE = "saturate(1.06) contrast(1.04)";

const imgProps = {
  decoding: "async" as const,
};

type WorkHomeBannerArtProps = {
  src: string;
  /** Shadow-only PNG — drawn ON TOP of base (not behind). */
  shadowOverlaySrc?: string;
  /** Optional blur behind silhouette for outer bloom */
  shadowGlowBleedSrc?: string;
  alt: string;
  width: number;
  height: number;
  aspectRatio: number;
  objectPosition: string;
  active?: boolean;
  welcomeSharp?: boolean;
};

/**
 * Layer stack (bottom → top):
 * 1. glow-bleed — optional outer bloom (mask)
 * 2. base — main logo
 * 3. shadow-overlay — mask on top; hover glow via CSS (static filter + opacity pulse)
 */
export function WorkHomeBannerArt({
  src,
  shadowOverlaySrc,
  shadowGlowBleedSrc,
  alt,
  width,
  height,
  aspectRatio,
  objectPosition,
  active = false,
  welcomeSharp = false,
}: WorkHomeBannerArtProps) {
  const artClass = [
    "work-home-logo__art",
    welcomeSharp && "work-home-logo__art--welcome-sharp",
    active && "work-home-logo__art--glow",
    shadowOverlaySrc && "work-home-logo__art--has-shadow-overlay",
  ]
    .filter(Boolean)
    .join(" ");

  const posStyle = {objectPosition};
  const artStyle = {
    ["--work-home-banner-object-position" as string]: objectPosition,
    ["--work-home-banner-aspect-ratio" as string]: String(aspectRatio),
  };
  const baseFilter = welcomeSharp && !active ? WELCOME_GRADE : undefined;

  return (
    <span className={artClass} style={artStyle}>
      {shadowGlowBleedSrc ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          {...imgProps}
          src={shadowGlowBleedSrc}
          alt=""
          aria-hidden
          width={width}
          height={height}
          className="work-home-logo__image work-home-logo__image--glow-bleed"
          style={posStyle}
        />
      ) : null}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        {...imgProps}
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="work-home-logo__image work-home-logo__image--base"
        style={{...posStyle, filter: baseFilter}}
      />
      {shadowOverlaySrc ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          {...imgProps}
          src={shadowOverlaySrc}
          alt=""
          aria-hidden
          width={width}
          height={height}
          className="work-home-logo__image work-home-logo__image--shadow-overlay"
          style={posStyle}
        />
      ) : null}
    </span>
  );
}
