import React from 'react'

export default ({ image, name, description, url }) => {
  return (
    <div>
      <img
        style={{
          width: '120px',
        }}
        src={image}
      />
      <br />
      <h3>{name}</h3>
      <p>{description}</p>
      <a href={url}>{url}</a>
    </div>
  )
}
