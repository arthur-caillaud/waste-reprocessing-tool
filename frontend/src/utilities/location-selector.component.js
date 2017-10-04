import React, {Component} from 'react';
import { Glyphicon } from 'react-bootstrap';
import { ListGroup, ListGroupItem } from 'react-bootstrap';

import '../styles/location-selection.css'

class LocationSelector extends Component {

  constructor(props) {
    super();
    this.state = {
      locations: props.locations,
      selected: props.selected,
      listHidden: true,
    }
  }

  displayList() {
    var listHidden = this.state.listHidden;
    this.setState({listHidden: !listHidden});
  }

  render() {

    console.log(this.state);
    // create location list to be displayed
    var i = 0;
    var locationsList = [];
    for (i=0; i<this.state.locations.length; i++) {
      if (i != this.state.selected) {
        locationsList.push(<ListGroupItem>{this.state.locations[i]}</ListGroupItem>);
      }
    }

    return (
      <div className="location-selector">
      {this.state.locations[this.state.selected]}
      <span hidden={ !this.state.listHidden }>
        <Glyphicon onClick={() => {this.displayList()}} glyph='triangle-right'/>
      </span>
      <span hidden={ this.state.listHidden }>
        <Glyphicon hidden="true" onClick={() => {this.displayList()}} glyph='triangle-bottom'/>
      </span>
      <div hidden={ this.state.listHidden }>
        <ListGroup>
          {locationsList}
        </ListGroup>
      </div>
    </div>
    )
  }
}

export default LocationSelector
