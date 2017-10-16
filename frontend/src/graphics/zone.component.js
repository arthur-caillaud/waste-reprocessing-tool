import React, { Component, } from 'react';

import Histogram from '../components/histogram.component';
import '../styles/containers.css';

class Zone extends Component {

  render() {
    return (
    <Histogram title="VEOLIA" id="prestataire-hist" />
    );
  }
}


export default Zone;
