import {AboutPageContent} from "@/components/about/AboutPageContent";
import {client} from "@/lib/sanity/client";
import {aboutQuery, contactQuery} from "@/lib/sanity/queries";
import type {AboutDocument, ContactDocument} from "@/lib/types/project";
import type {Metadata} from "next";
import {notFound} from "next/navigation";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const about = await client.fetch<AboutDocument | null>(aboutQuery);
  return {
    title: about?.name ? `About — ${about.name}` : "About",
  };
}

export default async function AboutPage() {
  const [about, contact] = await Promise.all([
    client.fetch<AboutDocument | null>(aboutQuery),
    client.fetch<ContactDocument | null>(contactQuery),
  ]);
  if (!about?.name) notFound();

  return <AboutPageContent about={about} contact={contact} />;
}
