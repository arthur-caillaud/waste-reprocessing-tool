import React, { Component } from 'react';

import { longText } from '../utilities/text-generator.component';

class Info extends Component {
  render() {
    return (
      <div>
        <h2> Informations générales </h2>
        <div>
          { longText }
        </div>
      </div>
    )
  }
}

export default Info;
