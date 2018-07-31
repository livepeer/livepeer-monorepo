import * as React from 'react'
/**
 * Exports a class for displaying an image
 */
class Image extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return <img src={this.props.imgSrc} alt={this.props.altText} />
  }
}

export { Image }
