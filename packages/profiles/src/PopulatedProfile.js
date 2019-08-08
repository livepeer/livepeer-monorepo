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
            <img
              style={{
                width: '120px',
              }}
              src={image}
            />
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
