import React from 'react'
import Box from './Box'

const MetricBox = ({ value, subvalue, title, suffix, prefix, children }) => {
  return (
    <Box width="50%">
      <h2
        style={{
          margin: 0,
          padding: 16,
          fontSize: 14,
          textTransform: 'uppercase',
          borderBottom: '1px solid #eee',
          color: '#666',
        }}
      >
        {title}
      </h2>
      <h3
        style={{
          borderBottom: children ? '1px solid #eee' : '',
          margin: 0,
          padding: `${24 + (!subvalue ? 12 : 0)}px 8px`,
        }}
      >
        {prefix}
        <strong
          style={{
            fontWeight: 400,
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          }}
        >
          {value}
        </strong>{' '}
        {suffix}
        <div
          style={{
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          }}
        >
          {subvalue && <span style={{ fontSize: 12 }}>{subvalue}</span>}
        </div>
      </h3>
      <div>{children}</div>
    </Box>
  )
}

export default MetricBox
