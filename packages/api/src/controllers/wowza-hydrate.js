// Todo: get this dynamically somehow? API endpoint on go-livepeer?
export const PRESETS = [
  {
    Name: 'P720p60fps16x9',
    Bitrate: '6000k',
    Framerate: 60,
    AspectRatio: '16:9',
    Resolution: '1280x720',
  },
  {
    Name: 'P720p30fps16x9',
    Bitrate: '4000k',
    Framerate: 30,
    AspectRatio: '16:9',
    Resolution: '1280x720',
  },
  {
    Name: 'P720p30fps4x3',
    Bitrate: '3500k',
    Framerate: 30,
    AspectRatio: '4:3',
    Resolution: '960x720',
  },
  {
    Name: 'P576p30fps16x9',
    Bitrate: '1500k',
    Framerate: 30,
    AspectRatio: '16:9',
    Resolution: '1024x576',
  },
  {
    Name: 'P360p30fps16x9',
    Bitrate: '1200k',
    Framerate: 30,
    AspectRatio: '16:9',
    Resolution: '640x360',
  },
  {
    Name: 'P360p30fps4x3',
    Bitrate: '1000k',
    Framerate: 30,
    AspectRatio: '4:3',
    Resolution: '480x360',
  },
  {
    Name: 'P240p30fps16x9',
    Bitrate: '600k',
    Framerate: 30,
    AspectRatio: '16:9',
    Resolution: '426x240',
  },
  {
    Name: 'P240p30fps4x3',
    Bitrate: '600k',
    Framerate: 30,
    AspectRatio: '4:3',
    Resolution: '320x240',
  },
  {
    Name: 'P144p30fps16x9',
    Bitrate: '400k',
    Framerate: 30,
    AspectRatio: '16:9',
    Resolution: '256x144',
  },
]

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
  const { transcoderAppConfig, transcoderTemplateAppConfig } = stream.wowza
  const templatesInUse = transcoderAppConfig.templatesInUse.split(',')
  let template
  // todo fixme xxx: handle the {SourceStreamName} case
  for (let tmpl of templatesInUse) {
    // these all end in .xml
    tmpl = tmpl.slice(0, tmpl.length - 4)
    if (transcoderTemplateAppConfig[tmpl] !== undefined) {
      template = tmpl
      break
    }
  }
  if (!template) {
    throw new Error('no template found from templatesInUse')
  }
  const transcoderConfig = transcoderTemplateAppConfig[template]
  const enabledEncodes = transcoderConfig.encodes.filter(e => e.enable)
  const renditions = {}
  const presets = []
  const encodeNameToRenditionName = {}
  for (const encode of enabledEncodes) {
    const { width, height, name, streamName, videoCodec } = encode
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
    const wowzaSize = width * height
    let diff = Infinity
    let foundPreset = null
    for (const preset of PRESETS) {
      const [livepeerWidth, livepeerHeight] = preset.Resolution.split('x').map(
        x => parseInt(x),
      )
      const livepeerSize = livepeerWidth * livepeerHeight
      const thisDiff = Math.abs(livepeerSize - wowzaSize)
      if (thisDiff < diff) {
        foundPreset = preset.Name
        diff = thisDiff
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
