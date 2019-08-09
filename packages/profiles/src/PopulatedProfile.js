import React from 'react'
import Avatar from './Avatar'

export default ({ image, name, description, url, address }) => {
  return (
    <div>
      {(() => {
        if (image != '' && image != undefined && image != null) {
          console.log('image defined')
          console.log(image)
          return (
            <>
              <div
                style={{
                  width: '120px',
                  height: '120px',
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: '50%',
                  display: 'block',
                  margin: '0 auto',
                }}
              >
                <img
                  src={image}
                  width={120}
                  style={{
                    display: 'inline',
                    margin: '0 auto',
                    height: '100%',
                    width: 'auto',
                  }}
                />
              </div>
            </>
          )
        } else {
          console.log('image undefined')
          return <Avatar id={address} size={120} />
        }
      })()}
      <br />
      <h3>{name}</h3>
      <p>{description}</p>
      <a href={url}>{url}</a>
    </div>
  )
}
