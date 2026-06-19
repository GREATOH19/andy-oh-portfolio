import {MoreSection} from "@/components/more/MoreSection";
import {ArchiveBlockPreview} from "@/components/more/ArchiveBlockPreview";
import {MoreMediaPreviewGrid} from "@/components/more/MoreMediaPreviewGrid";
import {flattenAlbumImages} from "@/lib/more/photos";
import type {MorePageDocument} from "@/lib/types/project";

export function MoreBlocks({page}: {page: MorePageDocument}) {
  const blocks = page.blocks ?? [];

  return (
    <div className="space-y-14 md:space-y-16">
      {blocks.map((block) => {
        if (block.enabled === false) return null;

        switch (block._type) {
          case "archiveBlock": {
            return (
              <MoreSection
                key={block._key}
                title={block.heading?.trim() || "Archive"}
                moreHref="/more/archive"
              >
                <ArchiveBlockPreview block={block} />
              </MoreSection>
            );
          }
          case "photographyBlock": {
            const images = flattenAlbumImages(block.albums);
            return (
              <MoreSection
                key={block._key}
                title={block.heading?.trim() || "Photography"}
                moreHref="/more/photography"
              >
                {images.length > 0 ? (
                  <MoreMediaPreviewGrid images={images} scopeKey={block._key} />
                ) : (
                  <p className="text-sm text-slate-500">No photos yet.</p>
                )}
              </MoreSection>
            );
          }
          case "behindTheScenesBlock": {
            const images = flattenAlbumImages(block.albums, block.images);
            return (
              <MoreSection
                key={block._key}
                title={block.heading?.trim() || "Behind the scene"}
                moreHref="/more/behind-the-scenes"
              >
                {images.length > 0 ? (
                  <MoreMediaPreviewGrid images={images} scopeKey={block._key} />
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
