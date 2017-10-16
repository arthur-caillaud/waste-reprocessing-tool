import React, { Component, } from 'react';

import Histogram from '../components/histogram.component';
import '../styles/containers.css';

class Zone extends Component {

  render() {
    return (
      <div className="mock-container">
        <Histogram title="VEOLIA" id="prestataire-hist" />
      </div>
    )
  }
}


export default Zone;
