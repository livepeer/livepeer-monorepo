import { VIDEO_PROFILES } from '@livepeer/sdk'

const PRESETS = Object.values(VIDEO_PROFILES)

/**
 * Replace a string containing "${SourceStreamName}" with the appropriate stream name
 */
const replaceStreamName = (str, name) =>
  str.replace('${SourceStreamName}', name)

/**
 * Take a data blob from Wowza and return the appropriate presets and names
 */
export default stream => {
  if (!stream.wowza) {
    return stream
  }
  if (!stream.name || !stream.id) {
    throw new Error('missing required fields: id, name')
  }
  const {
    transcoderAppConfig,
    transcoderTemplateAppConfig,
    sourceInfo,
  } = stream.wowza
  const templatesInUse = transcoderAppConfig.templatesInUse.split(',')
  let template
  for (let tmpl of templatesInUse) {
    let tmplName = replaceStreamName(tmpl, stream.name)
    // these all end in .xml
    tmplName = tmplName.slice(0, tmplName.length - 4)
    if (transcoderTemplateAppConfig[tmplName] !== undefined) {
      template = tmplName
      break
    }
  }
  if (!template) {
    throw new Error('no template found from templatesInUse')
  }
  const transcoderConfig = transcoderTemplateAppConfig[template]
  const enabledEncodes = transcoderConfig.encodes.filter(e => e.enable)
  const renditions = {}
  let presets = []
  const encodeNameToRenditionName = {}
  const aspectRatio = sourceInfo.width / sourceInfo.height
  for (const encode of enabledEncodes) {
    let { width, height, name, streamName, videoCodec } = encode
    let renditionName = replaceStreamName(streamName, stream.name)
    // These can be of the form mp4:name, let's ignore the first bit if present
    if (renditionName.includes(':')) {
      renditionName = renditionName.substr(renditionName.indexOf(':') + 1)
    }
    encodeNameToRenditionName[name] = renditionName
    if (videoCodec === 'PassThru') {
      renditions[renditionName] = `/stream/${stream.id}/source.m3u8`
      continue
    }

    if (width === 0) width = height * aspectRatio
    if (height === 0) height = (width * 1) / aspectRatio
    // TODO: do we need to validate whether or not the incoming height/width fit the aspect ratio?

    const wowzaSize = width * height
    const wowzaFps = sourceInfo.fps
    let diff = Infinity
    let fpsDiff = Infinity
    let foundPreset = null

    for (const preset of PRESETS) {
      const [livepeerWidth, livepeerHeight] = preset.resolution
        .split('x')
        .map(x => parseInt(x))
      const livepeerSize = livepeerWidth * livepeerHeight
      const thisDiff = Math.abs(livepeerSize - wowzaSize)
      const thisFpsDiff = Math.abs(preset.framerate - wowzaFps)
      if (thisDiff < diff || (thisDiff == diff && thisFpsDiff < fpsDiff)) {
        foundPreset = preset.name
        diff = thisDiff
        fpsDiff = thisFpsDiff
      }
    }

    if (!foundPreset) {
      throw new Error(
        `couldn't find Livepeer preset for Wowza encode: ${JSON.stringify(
          encode,
        )}`,
      )
    }
    renditions[renditionName] = `/stream/${stream.id}/${foundPreset}.m3u8`
    presets.push(foundPreset)
  }
  // Dedupe presets
  presets = [...new Set(presets)]
  const enabledEncodeNames = new Set(enabledEncodes.map(encode => encode.name))
  const streamNameGroups = transcoderConfig.streamNameGroups.map(
    streamNameGroup => {
      const name = replaceStreamName(streamNameGroup.streamName, stream.name)
      const renditions = streamNameGroup.Members.map(m => m.encodeName)
        .filter(name => enabledEncodeNames.has(name))
        .map(encodeName => encodeNameToRenditionName[encodeName])
      return { name, renditions }
    },
  )
  return {
    ...stream,
    wowza: {
      ...stream.wowza,
      streamNameGroups,
    },
    renditions,
    presets,
  }
}
