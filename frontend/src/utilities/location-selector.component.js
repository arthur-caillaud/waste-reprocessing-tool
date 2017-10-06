import React, {Component} from 'react';
import { Glyphicon, Popover, OverlayTrigger } from 'react-bootstrap';
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

    // create location list to be displayed
    var i = 0;
    var locationsList = [];
    for (i=0; i<this.state.locations.length; i++) {
      if (i !== this.state.selected) {
        locationsList.push(<ListGroupItem>{this.state.locations[i]}</ListGroupItem>);
      }
    }

    const list = (
      <Popover className="location-list" id="list" title="Choisissez un lieu">
        <ListGroup>
          { locationsList }
        </ListGroup>
      </Popover>
    );

    if (this.state.listHidden) {
      var button = (<Glyphicon glyph='triangle-right' onClick={() => this.displayList()}/>);
    }
    else {
      var button = (<Glyphicon glyph='triangle-bottom' onClick={() => this.displayList()}/>);
    }

    return (
      <div className="location-selector">
        {this.state.locations[this.state.selected]}
        <OverlayTrigger onClick={() => this.displayList()} trigger="click" placement="bottom" overlay={list}>
          {button}
        </OverlayTrigger>
      </div>
    )
  }
}

export default LocationSelector
