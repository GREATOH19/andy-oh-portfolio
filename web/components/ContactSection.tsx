import Link from "next/link";

type ContactLink = { label: string; href: string };

export function ContactSection({
  heading,
  subheading,
  email,
  links,
}: {
  heading?: string | null;
  subheading?: string | null;
  email?: string | null;
  links?: ContactLink[] | null;
}) {
  const safeHeading = heading ?? "Let’s connect";
  const safeSubheading = subheading ?? "For collaborations, inquiries, or just to say hello.";
  const safeEmail = email ?? null;
  const safeLinks = links ?? [];

  return (
    <section className="mt-24">
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Contact</p>
          <h2 className="mt-4 font-serif text-4xl font-light leading-tight text-slate-950 sm:text-5xl">
            {safeHeading}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600">{safeSubheading}</p>
          {safeEmail ? (
            <a
              href={`mailto:${safeEmail}`}
              className="mt-6 inline-block text-lg text-slate-700 underline decoration-slate-300 underline-offset-4 transition-colors hover:text-slate-500"
            >
              {safeEmail}
            </a>
          ) : null}
        </div>

        {safeLinks.length ? (
          <nav className="flex flex-wrap gap-x-8 gap-y-3 text-sm font-medium uppercase tracking-[0.2em] text-slate-400">
            {safeLinks.map((l) => {
              const isExternal = /^https?:\/\//.test(l.href) || /^mailto:/.test(l.href) || /^tel:/.test(l.href);
              return isExternal ? (
                <a
                  key={`${l.href}-${l.label}`}
                  href={l.href}
                  target={/^https?:\/\//.test(l.href) ? "_blank" : undefined}
                  rel={/^https?:\/\//.test(l.href) ? "noopener noreferrer" : undefined}
                  className="transition-colors hover:text-slate-500"
                >
                  {l.label}
                </a>
              ) : (
                <Link key={`${l.href}-${l.label}`} href={l.href} className="transition-colors hover:text-slate-500">
                  {l.label}
                </Link>
              );
            })}
          </nav>
        ) : null}
      </div>
    </section>
  );
}

