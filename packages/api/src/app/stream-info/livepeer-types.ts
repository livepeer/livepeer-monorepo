

export interface MasterPlaylist {
  Variants: Array<Variant>
  Args: string // optional arguments placed after URI (URI?Args)
  CypherVersion: string // non-standard tag for Widevine (see also WV struct)
}

export interface VariantParams {
  ProgramId: number
  Bandwidth: number
  Codecs: string
  Resolution: string
  Audio: string // EXT-X-STREAM-INF only
  Video: string
  Subtitles: string         // EXT-X-STREAM-INF only
  Captions: string         // EXT-X-STREAM-INF only
  Name: string         // EXT-X-STREAM-INF only (non standard Wowza/JWPlayer extension to name the variant/quality in UA)
  Iframe: boolean           // EXT-X-I-FRAME-STREAM-INF
  Alternatives: Array<Alternative> // EXT-X-MEDIA
}

// Alternative structure represents EXT-X-MEDIA tag in variants.
export interface Alternative {
  GroupId: string
  URI: string
  Type: string
  Language: string
  Name: string
  Default: boolean
  Autoselect: string
  Forced: string
  Characteristics: string
  Subtitles: string
}

// Variant structure represents variants for master playlist.
// Variants included in a master playlist and point to media playlists.
export interface Variant extends VariantParams {
  URI: string
  Chunklist: MediaPlaylist
}

export enum MediaType { NOTDEFINED, EVENT, VOD }

export interface MediaPlaylist {
  TargetDuration: number
  SeqNo: number // EXT-X-MEDIA-SEQUENCE
  Segments: Array<MediaSegment>
  Args: string // optional arguments placed after URIs (URI?Args)
  Iframe: boolean   // EXT-X-I-FRAMES-ONLY
  Live: boolean   // is this a VOD or Live (sliding window) playlist?
  MediaType: MediaType
  // Key            *Key        // EXT-X-KEY is optional encryption key displayed before any segments (default key for the playlist)
  // Map            *Map        // EXT-X-MAP is optional tag specifies how to obtain the Media Initialization Section (default map for the playlist)
}

// MediaSegment structure represents a media segment included in a media playlist.
// Media segment may be encrypted.
// Widevine supports own tags for encryption metadata.
export interface MediaSegment {
  SeqId: number
  Title: string // optional second parameter for EXTINF tag
  URI: string
  Duration: number   // first parameter for EXTINF tag; duration must be integers if protocol version is less than 3 but we are always keep them float
  Limit: number     // EXT-X-BYTERANGE <n> is length in bytes for the file under URI
  Offset: number     // EXT-X-BYTERANGE [@o] is offset from the start of the file under URI
  Discontinuity: boolean      // EXT-X-DISCONTINUITY indicates an encoding discontinuity between the media segment that follows it and the one that preceded it (i.e. file format, number and type of tracks, encoding parameters, encoding sequence, timestamp sequence)
  // Key             *Key      // EXT-X-KEY displayed before the segment and means changing of encryption key (in theory each segment may have own key)
  // Map             *Map      // EXT-X-MAP displayed before the segment
  // SCTE            *SCTE     // SCTE-35 used for Ad signaling in HLS
  // ProgramDateTime time.Time // EXT-X-PROGRAM-DATE-TIME tag associates the first sample of a media segment with an absolute date and/or time
}


export interface RemoteTranscoderInfo {
  Address: string
  Capacity: Number
}

export interface MasterPlaylistDictionary {
  [index: string]: MasterPlaylist;
}

export interface StatusResponse {
  // Manifests: Map<string, MasterPlaylist>
  Manifests: MasterPlaylistDictionary
  OrchestratorPool: Array<string>
  Version: string
  GolangRuntimeVersion: string
  GOArch: string
  GOOS: string
  RegisteredTranscodersNumber: Number
  RegisteredTranscoders: Array<RemoteTranscoderInfo>
  LocalTranscoding: boolean // Indicates orchestrator that is also transcoder
}
