import React, { Component, } from 'react';

import { Image } from 'react-bootstrap';

import image from '../resources/logo.png';

class Zone extends Component {

  render() {
    return (
      <Image src={image} responsive alt="yolo"/>
    )
  }
}


export default Zone;
