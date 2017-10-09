import React, {Component} from 'react';
import { Glyphicon, Popover, OverlayTrigger } from 'react-bootstrap';
import { ListGroup, ListGroupItem } from 'react-bootstrap';

import '../styles/location-search.css'

class LocationSearchContainer extends Component {
    constructor(props) {
        super();
        console.log("Props",props);
        this.state = {
            data: props.data,
        }
    }

    render() {
        var searchContainer = [];
        console.log("Rendering searchContainer");
        if(this.state.data){
            console.log("Found data")
            console.log("Data", this.state.data);
            this.state.data.forEach(searchResult => {
                searchContainer.push(
                    <ListGroupItem header={searchResult.value}>
                    {searchResult.type}
                    </ListGroupItem>
                );
            })
        };
        console.log(searchContainer);
        return (
            <ListGroup>
              {searchContainer}
            </ListGroup>
        );
    }
}

export default LocationSearchContainer
