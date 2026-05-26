import type { Metadata } from "next";
import {
  DM_Sans,
  Geist,
  Geist_Mono,
  Gloock,
  Instrument_Serif,
  Pinyon_Script,
  Playfair_Display,
  Space_Grotesk,
} from "next/font/google";
import { ConditionalFooter } from "@/components/ConditionalFooter";
import { ContactFooter } from "@/components/ContactFooter";
import { DocumentOverflowReset } from "@/components/DocumentOverflowReset";
import { DebugBodyStyleReporter } from "@/components/DebugBodyStyleReporter";
import { ScrollGradient } from "@/components/ScrollGradient";
import { SiteHeader } from "@/components/SiteHeader";
import { TypographyProvider } from "@/components/TypographyProvider";
import { client } from "@/lib/sanity/client";
import { fetchMorePage } from "@/lib/more/fetchMorePage";
import { getMoreNavDropdownItems } from "@/lib/more/nav";
import { contactQuery, siteSettingsQuery } from "@/lib/sanity/queries";
import type { ContactDocument, SiteSettingsDocument } from "@/lib/types/project";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-magazine-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
});

/** Extra logo text options — keep in sync with `SiteBrandFont` + `brandFontClass` in BrandMark */
const brandDmSans = DM_Sans({
  variable: "--font-brand-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const brandInstrumentSerif = Instrument_Serif({
  variable: "--font-brand-instrument-serif",
  subsets: ["latin"],
  weight: ["400"],
});

const brandPinyonScript = Pinyon_Script({
  variable: "--font-brand-pinyon-script",
  subsets: ["latin"],
  weight: ["400"],
});

const brandGloock = Gloock({
  variable: "--font-brand-gloock-serif",
  subsets: ["latin"],
  weight: ["400"],
});

const brandSpaceGrotesk = Space_Grotesk({
  variable: "--font-brand-space-grotesk-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Andy Oh - Industrial Design",
    template: "%s - Andy Oh",
  },
  description: "Minimal industrial design portfolio.",
};

/** Match other routes so header/footer Sanity content can refresh without a redeploy. */
export const revalidate = 60;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [settings, contactDoc, morePage] = await Promise.all([
    client.fetch<SiteSettingsDocument | null>(siteSettingsQuery),
    client.fetch<ContactDocument | null>(contactQuery),
    fetchMorePage(),
  ]);
  const contact = settings?.contactSection ?? null;
  const brand = settings?.brand ?? null;
  const workHomeLogo = settings?.workHomeLogo ?? null;
  const typography = settings?.typography ?? null;
  const moreNavDropdownItems = getMoreNavDropdownItems(morePage);

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${brandDmSans.variable} ${brandInstrumentSerif.variable} ${brandPinyonScript.variable} ${brandGloock.variable} ${brandSpaceGrotesk.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col text-slate-900">
        <TypographyProvider typography={typography}>
          <DocumentOverflowReset />
          <ScrollGradient />
          <DebugBodyStyleReporter />
          <SiteHeader
            brand={brand}
            moreNavDropdownItems={moreNavDropdownItems}
            moreNavLabel={morePage.title?.trim() || "More"}
          />
          <main className="relative z-[1] flex min-h-0 flex-1 flex-col">
            <div className="flex min-h-0 flex-1 flex-col">{children}</div>
            <ConditionalFooter>
              <ContactFooter
                links={contact?.links ?? []}
                brand={brand}
                workHomeLogo={workHomeLogo}
                channels={contactDoc?.channels ?? []}
                footerBody={contact?.footerBody ?? undefined}
              />
            </ConditionalFooter>
          </main>
        </TypographyProvider>
      </body>
    </html>
  );
}
