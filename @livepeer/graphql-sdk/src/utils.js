export function transformJob({
  jobId,
  streamId,
  transcodingOptions,
  broadcaster,
}) {
  return {
    type: 'JobType',
    id: jobId,
    broadcaster,
    profiles: transcodingOptions.map(({ hash, ...profile }) => ({
      id: hash,
      ...profile,
    })),
    streamId: streamId,
  }
}
