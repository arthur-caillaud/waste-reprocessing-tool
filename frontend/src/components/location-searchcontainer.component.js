import React, {Component} from 'react';
import { Glyphicon, Popover, OverlayTrigger } from 'react-bootstrap';
import { ListGroup, ListGroupItem } from 'react-bootstrap';

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
        if(this.props.data){
            this.props.data.forEach(searchResult => {
                searchContainer.push(
                    <ListGroupItem header={searchResult.value}>
                    {searchResult.type}
                    </ListGroupItem>
                );
            })
        };
        return (
            <ListGroup>
              {searchContainer}
            </ListGroup>
        );
    }
}

export default LocationSearchContainer
