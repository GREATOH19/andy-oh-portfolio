import {sanityAudioUrl} from "@/lib/sanity/media";
import type {ProjectAudioBlock} from "@/lib/types/project";
import {StoryBlockLayout} from "@/components/project/StoryBlockLayout";
import {ProjectAudioPlayer} from "@/components/project/ProjectAudioPlayer";

export function ProjectAudioSection({block}: {block: ProjectAudioBlock}) {
  const url = sanityAudioUrl(block.audio);
  if (!url) return null;

  return (
    <StoryBlockLayout layout={block}>
      <ProjectAudioPlayer
        src={url}
        title={block.title?.trim() || null}
        cover={block.cover}
        caption={block.caption?.trim() || null}
        loop={block.loop}
        autoplay={block.autoplay}
      />
    </StoryBlockLayout>
  );
}
