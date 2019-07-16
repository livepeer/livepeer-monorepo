import React from 'react'

export default ({ image, name, description, url }) => {
  return (
    <div>
      <img
        style={{
          width: '100px',
        }}
        src={image}
      />
      <br />
      <span>test text</span>
      <span>{name}</span>
      <br />
      <p>{description}</p>
      <a href={url}>{url}</a>
    </div>
  )
}
