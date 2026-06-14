import {MemberField} from 'sanity'
import {Box, Card, Label, Stack, Text} from '@sanity/ui'
import {BENTO_COLUMNS, packBentoItems} from '../../collage/bentoPack.js'

function collageImageUrl(image) {
  const asset = image?.asset
  if (!asset) return null
  if (typeof asset.url === 'string' && asset.url) return asset.url
  const ref = asset._ref ?? asset._id
  if (typeof ref !== 'string') return null
  const match = ref.match(/^image-(.+)-(\w+)$/)
  if (!match) return null
  return `https://cdn.sanity.io/images/sttir3vc/production/${match[1]}.${match[2]}?w=400&h=400&fit=crop`
}

function BentoPreview({items}) {
  const {placed, rowCount} = packBentoItems(items)

  return (
    <Card padding={3} radius={2} shadow={1} tone="transparent">
      <Box
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${BENTO_COLUMNS}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${rowCount}, minmax(2.25rem, 1fr))`,
          gap: 4,
          width: '100%',
          minHeight: 120,
          background: '#f4f4f5',
          borderRadius: 8,
          border: '1px solid #d4d4d8',
          padding: 4,
        }}
      >
        {placed.map((tile, index) => {
          const item = items[index]
          const previewUrl =
            item?.media?.mediaType === 'image' ? collageImageUrl(item.media?.image) : null
          const label =
            item?.media?.alt ||
            (item?.media?.mediaType === 'video'
              ? 'Video'
              : item?.media?.mediaType === 'youtube'
                ? 'YouTube'
                : `${index + 1}`)

          return (
            <Box
              key={tile.key}
              style={{
                gridColumn: `${tile.colStart} / span ${tile.colSpan}`,
                gridRow: `${tile.rowStart} / span ${tile.rowSpan}`,
                borderRadius: 6,
                overflow: 'hidden',
                background: '#a1a1aa',
                border: '1px solid rgba(255,255,255,0.9)',
                boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
                minHeight: 0,
              }}
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt=""
                  style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}}
                />
              ) : (
                <Text
                  size={1}
                  muted
                  style={{
                    display: 'flex',
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 6,
                    textAlign: 'center',
                  }}
                >
                  {label}
                </Text>
              )}
            </Box>
          )
        })}
      </Box>
      <Text size={1} muted style={{marginTop: 8}}>
        12-column bento · tiles snap to the grid · drag items below to reorder
      </Text>
    </Card>
  )
}

export function BentoGridInput(props) {
  const {
    value,
    members,
    renderField,
    renderInput,
    renderItem,
    renderPreview,
    renderAnnotation,
    renderBlock,
    renderInlineBlock,
  } = props

  const items = Array.isArray(value?.items) ? value.items : []
  const memberRenderProps = {
    renderField,
    renderInput,
    renderItem,
    renderPreview,
    renderAnnotation,
    renderBlock,
    renderInlineBlock,
  }

  const itemsMember = members.find((m) => m.kind === 'field' && m.name === 'items')
  const otherMembers = members.filter((m) => m.kind === 'field' && m.name !== 'items')

  return (
    <Stack space={4}>
      <Stack space={3}>
        <Label size={1}>Bento layout preview</Label>
        <BentoPreview items={items} />
      </Stack>

      {itemsMember ? <MemberField member={itemsMember} {...memberRenderProps} /> : null}

      {otherMembers.map((member) => (
        <MemberField key={member.key} member={member} {...memberRenderProps} />
      ))}
    </Stack>
  )
}
