/**
 * Replace a string containing "${SourceStreamName}" with the appropriate stream name
 */
const replaceStreamName = (str, name) =>
  str.replace('${SourceStreamName}', name)

/**
 * Take a data blob and return the appropriate profiles and names
 */
export default (stream) => {
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
  const enabledEncodes = transcoderConfig.encodes.filter((e) => e.enable)
  const renditions = {}
  let profiles = []
  const encodeNameToRenditionName = {}
  const aspectRatio = sourceInfo.width / sourceInfo.height
  var i
  for (i = 0; i < enabledEncodes.length; i++) {
    let {
      width,
      height,
      name,
      streamName,
      videoCodec,
      videoBitrate,
    } = enabledEncodes[i]
    if (width === 0 && height === 0 && name != 'source') {
      enabledEncodes.splice(i, 1)
      continue
    }

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

    let intHeight = Math.round(height)
    let intWidth = Math.round(width)
    if (intHeight % 2 !== 0) intHeight--
    if (intWidth % 2 !== 0) intWidth--

    const profile = {
      name: renditionName,
      height: intHeight,
      width: intWidth,
      bitrate: Math.round(parseInt(videoBitrate)),
      fps: Math.round(sourceInfo.fps),
    }

    renditions[renditionName] = `/stream/${stream.id}/${renditionName}.m3u8`
    profiles.push(profile)
  }

  // Dedupe profiles
  profiles = [...new Set(profiles)]
  const enabledEncodeNames = new Set(
    enabledEncodes.map((encode) => encode.name),
  )
  const streamNameGroups = transcoderConfig.streamNameGroups.map(
    (streamNameGroup) => {
      const name = replaceStreamName(streamNameGroup.streamName, stream.name)
      const renditions = streamNameGroup.Members.map((m) => m.encodeName)
        .filter((name) => enabledEncodeNames.has(name))
        .map((encodeName) => encodeNameToRenditionName[encodeName])
      return { name, renditions }
    },
  )
  const presets = []
  return {
    ...stream,
    wowza: {
      ...stream.wowza,
      streamNameGroups,
    },
    renditions,
    profiles,
    presets,
  }
}
