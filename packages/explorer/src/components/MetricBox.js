import * as React from 'react'
import { Icon } from 'rmwc/Icon'
import Box from './Box'
import Tooltip from './Tooltip'

const MetricBox = ({
  help = '',
  value,
  subvalue,
  title,
  suffix,
  prefix,
  width,
  children,
  ...props
}) => {
  return (
    <Box width={width || '50%'} {...props}>
      <h2
        style={{
          margin: 0,
          padding: 16,
          fontSize: 14,
          borderBottom: '1px solid #eee',
          color: '#666',
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <span style={{ textTransform: 'uppercase' }}>{title}</span>
        {help && (
          <Tooltip text={help}>
            <Icon
              icon="info"
              style={{
                opacity: 0.5,
                fontSize: 17,
                marginLeft: 4,
                cursor: 'help',
              }}
            />
          </Tooltip>
        )}
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
