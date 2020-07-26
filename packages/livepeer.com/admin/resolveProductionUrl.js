const previewSecret = process.env.SANITY_PREVIEW_SECRET
const projectUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://livepeer.com'
    : 'http://localhost:3004'

export default function resolveProductionUrl(document) {
  return `${projectUrl}/api/preview?secret=${previewSecret}&type=${document._type}&slug=${document.slug.current}`
}
