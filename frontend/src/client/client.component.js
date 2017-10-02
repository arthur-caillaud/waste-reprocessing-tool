import React, { Component } from 'react';

import { longText } from '../utilities/text-generator.component';

class Client extends Component {
  render() {
    return (
      <div>
        <div>
          <h2>Vision prestataire</h2>
        </div>
        <div>
          { longText }
        </div>
    </div>
    );
  }
}

export default Client;
