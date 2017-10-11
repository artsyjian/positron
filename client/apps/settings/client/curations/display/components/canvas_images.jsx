import PropTypes from 'prop-types'
import React from 'react'
import { Col, Row } from 'react-styled-flexboxgrid'
import ImageUpload from 'client/apps/edit/components/admin/components/image_upload.coffee'

export default class CanvasImages extends React.Component {
  onSlideshowImageChange = (imgIndex, url) => {
    const { assets } = this.props.campaign.canvas
    if (imgIndex || imgIndex === 0) {
      if (url.length) {
        assets[imgIndex].url = url
      } else {
        assets.splice(imgIndex, 1)
      }
    } else {
      assets.push({ url })
    }
    return assets
  }

  onImageInputChange = (key, value, imgIndex) => {
    let newValue
    if (this.props.campaign.canvas.layout === 'slideshow') {
      newValue = this.onSlideshowImageChange(imgIndex, value)
    } else {
      newValue = value.length ? [{url: value}] : []
    }
    this.props.onChange(key, newValue, this.props.index)
  }

  renderAssets = () => {
    const { assets } = this.props.campaign.canvas
    const uploads = assets.map((asset, imgIndex) => {
      if (imgIndex === 0) {
        return false
      } else {
        return (
          <Col lg key={'slideshow-image-' + imgIndex}>
            <label>{this.renderLabel(imgIndex)}</label>
            {this.renderImageUpload(assets, imgIndex)}
          </Col>
        )
      }
    })
    return uploads
  }

  renderSlideshowImages = () => {
    return (
      <Row className='slideshow-images'>
        {this.renderAssets()}
        {this.props.campaign.canvas.assets.length < 5 &&
          <Col lg className='add-new'>
            {this.renderImageUpload(this.props.campaign.canvas.assets)}
          </Col>
        }
      </Row>
    )
  }

  renderLogoUpload = () => {
    const {campaign, index, onChange} = this.props
    return (
      <Col lg>
        <label>Logo</label>
        <ImageUpload
          name='canvas.logo'
          src={campaign.canvas && campaign.canvas.logo}
          onChange={(name, url) => onChange(name, url, index)}
          disabled={false} />
      </Col>
    )
  }

  renderImageUpload = (assets, imgIndex) => {
    const hasVideo = this.props.campaign.canvas.layout !== 'slideshow'
    const hidePreview = !imgIndex && imgIndex !== 0 && !hasVideo
    return (
      <ImageUpload
        key={'canvas-assets-' + (imgIndex || 0)}
        name='canvas.assets'
        hasVideo={hasVideo}
        hidePreview={hidePreview}
        src={assets[imgIndex] ? assets[imgIndex].url : ''}
        onChange={(name, url) => this.onImageInputChange(name, url, imgIndex)} />
    )
  }

  renderLabel = (imgIndex) => {
    const { campaign, isSlideshow } = this.props
    if (campaign.canvas.layout === 'overlay') {
      return 'Background Image'
    } else if (isSlideshow) {
      const index = imgIndex ? imgIndex + 1 : 1
      return 'Image ' + index.toString()
    } else {
      return 'Image / Video'
    }
  }

  render () {
    const { campaign, isSlideshow } = this.props

    return (
      <div
        className='display-admin--canvas-images'
        data-layout={campaign.canvas.layout || 'overlay'}>
        <Row>
          {this.renderLogoUpload()}
          <Col lg>
            <label>{this.renderLabel()}</label>
            {this.renderImageUpload(campaign.canvas.assets || [], 0)}
          </Col>
        </Row>
        {isSlideshow && this.renderSlideshowImages()}
      </div>
    )
  }
}

CanvasImages.propTypes = {
  campaign: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  isSlideshow: PropTypes.bool,
  onChange: PropTypes.func.isRequired
}
