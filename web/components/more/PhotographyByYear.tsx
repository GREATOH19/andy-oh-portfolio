import {PhotoThumbnailGrid} from "@/components/more/PhotoThumbnailGrid";
import {groupPhotographyAlbums} from "@/lib/more/photos";
import type {PhotoAlbum} from "@/lib/types/project";

export function PhotographyByYear({albums}: {albums?: PhotoAlbum[] | null}) {
  const groups = groupPhotographyAlbums(albums);
  if (groups.length === 0) return null;

  return (
    <div className="space-y-16 md:space-y-20">
      {groups.map((group, index) => (
        <section key={group.yearLabel || `no-year-${index}`}>
          {group.yearLabel ? (
            <h2 className="mb-2 font-serif text-3xl font-light text-slate-950 sm:text-4xl">{group.yearLabel}</h2>
          ) : null}
          {group.title ? (
            <p className="mb-8 text-sm text-slate-500">{group.title}</p>
          ) : group.yearLabel ? (
            <div className="mb-8" />
          ) : null}
          <PhotoThumbnailGrid images={group.images} columns={3} />
        </section>
      ))}
    </div>
  );
}
