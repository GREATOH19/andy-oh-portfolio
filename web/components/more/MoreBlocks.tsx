import {MoreSection} from "@/components/more/MoreSection";
import {PhotoThumbnailGrid} from "@/components/more/PhotoThumbnailGrid";
import {ProjectCard} from "@/components/ProjectCard";
import {MORE_PREVIEW_LIMIT} from "@/lib/more/photos";
import {sortProjectsByYearDesc} from "@/lib/more/year";
import {flattenAlbumImages, filterValidImages} from "@/lib/more/photos";
import type {MoreBlock, MorePageDocument} from "@/lib/types/project";

function ArchiveBlockPreview({block}: {block: Extract<MoreBlock, {_type: "archiveBlock"}>}) {
  const projects = sortProjectsByYearDesc((block.archiveProjects ?? []).filter((p) => p?.slug)).slice(
    0,
    MORE_PREVIEW_LIMIT,
  );
  if (projects.length === 0) return <p className="text-sm text-slate-500">No archive projects yet.</p>;

  return (
    <div className="grid w-full grid-cols-3 gap-x-4 gap-y-12 sm:gap-x-5 md:gap-x-6 sm:gap-y-14">
      {projects.map((project) => (
        <div key={project._id}>
          <ProjectCard project={project} />
        </div>
      ))}
    </div>
  );
}

export function MoreBlocks({page}: {page: MorePageDocument}) {
  const blocks = page.blocks ?? [];

  return (
    <div className="space-y-14 md:space-y-16">
      {blocks.map((block) => {
        if (block.enabled === false) return null;

        switch (block._type) {
          case "archiveBlock":
            return (
              <MoreSection
                key={block._key}
                title={block.heading?.trim() || "Archive"}
                moreHref="/more/archive"
              >
                <ArchiveBlockPreview block={block} />
              </MoreSection>
            );
          case "photographyBlock": {
            const images = flattenAlbumImages(block.albums).slice(0, MORE_PREVIEW_LIMIT);
            return (
              <MoreSection
                key={block._key}
                title={block.heading?.trim() || "Photography"}
                moreHref="/more/photography"
              >
                {images.length > 0 ? (
                  <PhotoThumbnailGrid images={images} columns={3} fixedColumns />
                ) : (
                  <p className="text-sm text-slate-500">No photos yet.</p>
                )}
              </MoreSection>
            );
          }
          case "behindTheScenesBlock": {
            const images = filterValidImages(block.images).slice(0, MORE_PREVIEW_LIMIT);
            return (
              <MoreSection
                key={block._key}
                title={block.heading?.trim() || "Behind the scene"}
                moreHref="/more/behind-the-scenes"
              >
                {images.length > 0 ? (
                  <PhotoThumbnailGrid images={images} columns={3} fixedColumns />
                ) : (
                  <p className="text-sm text-slate-500">No photos yet.</p>
                )}
              </MoreSection>
            );
          }
          default:
            return null;
        }
      })}
    </div>
  );
}
