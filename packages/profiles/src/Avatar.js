import React from 'react'
import QRCode from 'qrcode-react'

const Avatar = ({ size, id, bg }) => {
  return (
    <div
      style={{
        // boxShadow: '0 0 0 1px #fff',
        display: 'inline-block',
        borderRadius: '50%',
        width: size,
        height: size,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: -size * 10,
          right: -size * 10,
          bottom: -size * 10,
          left: -size * 10,
          width: size,
          height: size,
          margin: 'auto',
          transform: 'scale(3) skew(45deg)',
          imageRendering: 'pixelated',
        }}
      >
        <QRCode
          size={size}
          value={id}
          fgColor={`#${id.substr(2, 6)}`}
          bgColor={bg || '#fff'}
        />
      </div>
    </div>
  )
}

export default Avatar
