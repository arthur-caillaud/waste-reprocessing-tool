import React, { Component } from 'react';

import { longText } from '../utilities/text-generator.component';

class Info extends Component {

  constructor(props) {
    super();
    this.state = {
      paragraphs: props.paragraphs,
    }
  }

  render() {
    var text = [];
    var i = 0;
    for (i=0; i<this.state.paragraphs; i++) {
      text.push(<p> { longText } </p>);
    }
    return (
      <div>
        <h2> Carte de France </h2>
        <div>
          { text }
        </div>
      </div>
    )
  }
}

export default Info;
