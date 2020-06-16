import { addProtocol } from './geolocate'

describe('geolocate middleware', () => {
  it('should return unchanged url if already has protocol', () => {
    const url = addProtocol('rtmp://host.live')
    expect(url).toEqual('rtmp://host.live')
  })

  it('should add default https', () => {
    const url = addProtocol('host.live')
    expect(url).toEqual('https://host.live')
  })

  it('should add provided protocol', () => {
    const url = addProtocol('host.live', 'hls')
    expect(url).toEqual('hls://host.live')
  })
})
