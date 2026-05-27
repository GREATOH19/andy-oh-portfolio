import {MoreSection} from "@/components/more/MoreSection";
import {PhotoThumbnailGrid} from "@/components/more/PhotoThumbnailGrid";
import {ProjectCard} from "@/components/ProjectCard";
import {masonryPreviewClass, masonryPreviewItemClass} from "@/components/ClickablePhotoGrid";
import {flattenAlbumImages, filterValidImages} from "@/lib/more/photos";
import {pickMorePreview} from "@/lib/more/preview";
import {sortProjectsByYearDesc} from "@/lib/more/year";
import type {MoreBlock, MorePageDocument, ProjectListItem} from "@/lib/types/project";

function ArchiveBlockPreview({
  projects,
}: {
  projects: ProjectListItem[];
}) {
  if (projects.length === 0) return <p className="text-sm text-slate-500">No archive projects yet.</p>;

  return (
    <div className={masonryPreviewClass}>
      {projects.map((project) => (
        <div key={project._id} className={masonryPreviewItemClass}>
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
          case "archiveBlock": {
            const projects = pickMorePreview(
              sortProjectsByYearDesc((block.archiveProjects ?? []).filter((p) => p?.slug)),
              block._key,
            );
            return (
              <MoreSection
                key={block._key}
                title={block.heading?.trim() || "Archive"}
                moreHref="/more/archive"
              >
                <ArchiveBlockPreview projects={projects} />
              </MoreSection>
            );
          }
          case "photographyBlock": {
            const images = pickMorePreview(flattenAlbumImages(block.albums), block._key);
            return (
              <MoreSection
                key={block._key}
                title={block.heading?.trim() || "Photography"}
                moreHref="/more/photography"
              >
                {images.length > 0 ? (
                  <PhotoThumbnailGrid images={images} layout="masonry" />
                ) : (
                  <p className="text-sm text-slate-500">No photos yet.</p>
                )}
              </MoreSection>
            );
          }
          case "behindTheScenesBlock": {
            const images = pickMorePreview(filterValidImages(block.images), block._key);
            return (
              <MoreSection
                key={block._key}
                title={block.heading?.trim() || "Behind the scene"}
                moreHref="/more/behind-the-scenes"
              >
                {images.length > 0 ? (
                  <PhotoThumbnailGrid images={images} layout="masonry" />
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
