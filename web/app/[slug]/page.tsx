import {CmsPageTitle} from "@/components/CmsPageTitle";
import {ProjectSections} from "@/components/ProjectSections";
import {client} from "@/lib/sanity/client";
import {pageBySlugQuery} from "@/lib/sanity/queries";
import type {PageDocument} from "@/lib/types/project";
import {notFound} from "next/navigation";

export const revalidate = 60;

type Props = {params: Promise<{slug: string}>};

export default async function CmsPage({params}: Props) {
  const {slug} = await params;

  // Keep existing hard-coded routes if they exist (about/contact in this repo).
  // This route is intended for future pages beyond those.
  const page = await client.fetch<PageDocument | null>(pageBySlugQuery, {slug});
  if (!page) notFound();

  const sections = page.sections ?? [];

  return (
    <>
      <div className="container-wide py-20 md:py-32">
        <header className="mb-14 border-b border-slate-100 pb-10">
          <CmsPageTitle title={page.title} />
        </header>

        {sections.length ? <ProjectSections sections={sections} /> : null}
      </div>
    </>
  );
}
