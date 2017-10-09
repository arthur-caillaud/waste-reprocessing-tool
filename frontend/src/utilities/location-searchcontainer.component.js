import React, {Component} from 'react';
import { Glyphicon, Popover, OverlayTrigger } from 'react-bootstrap';
import { ListGroup, ListGroupItem } from 'react-bootstrap';

import '../styles/location-search.css'

class LocationSearchContainer extends Component {
    constructor(props) {
        super();
        this.state = {
            data: props.searchContainerData,
        }
    }

    render() {
        var searchContainer = [];
        if(this.state.data){
            this.state.data.forEach(searchResult => {
                searchContainer.push(<ListGroupItem header={searchResult.value}>{searchResult.type}</ListGroupItem>)
            })
        }
        return (
            <ListGroup>
              {searchContainer}
            </ListGroup>
        );
    }
}

export default LocationSearchContainer
