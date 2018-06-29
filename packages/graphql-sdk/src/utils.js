export function transformJob({
  id,
  streamId,
  transcodingOptions,
  broadcaster,
}) {
  return {
    type: 'JobType',
    id,
    broadcaster,
    profiles: transcodingOptions.map(({ hash, ...profile }) => ({
      id: hash,
      ...profile,
    })),
    streamId: streamId,
  }
}
