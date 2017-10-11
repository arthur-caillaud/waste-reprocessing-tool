import React, {Component} from 'react';
import { Glyphicon, Popover, OverlayTrigger } from 'react-bootstrap';
import { ListGroup, ListGroupItem } from 'react-bootstrap';

import LocationSearchContainer from './location-searchcontainer.component'

class LocationSearch extends Component {
    constructor(props) {
        super();
        this.state = {
            input: props.input,
            focus: true,
            data: [props.globalSites, props.units1, props.units2, props.sites],
            searchContainerData: []
        }
    }

    searchInWord(input,word){
        var inputLen = input.length;
        var wordLen = word.length;
        if(inputLen <= wordLen){
            if (word.toLowerCase().slice(0,inputLen) === input.toLowerCase()){
                return true;
            }
        }
        return false;
    }

    searchInData(input) {
        var data = this.state.data;
        var resArray = [];
        var typeArray = ["Metier","UP de dépendance","Unité de dépendance","Site"];
        if(input.length > 0){
            for(var i = 0; i<data.length; i++){
                data[i].forEach(location => {
                    if (this.searchInWord(input,location)){
                        resArray.push({
                            type: typeArray[i],
                            value: location,
                        })
                    }
                });
            };
        }
        this.setState({searchContainerData: resArray});
    }

    render() {

        var input = <input type="text" className="location-selection-zone searchMode" onKeyUp={(e) => this.searchInData(e.target.value)}/>
        var searchContainter = <LocationSearchContainer data={this.state.searchContainerData} />;

        return(
        <div>
          {input}
          {searchContainter}
        </div>
        );
    }
}

export default LocationSearch