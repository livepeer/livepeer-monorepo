const PopulatedProfile = (image, name, description, url) => {
  return (
    <div>
      <img
        style={{
          width: '100px',
        }}
        src={image}
      />
      <br />
      <span>{name}</span>
      <br />
      <p>{description}</p>
      <a href={url}>{url}</a>
      <Button
        onClick={() => {
          resetProf()
        }}
      >
        Reset Profile
      </Button>
    </div>
  )
}
