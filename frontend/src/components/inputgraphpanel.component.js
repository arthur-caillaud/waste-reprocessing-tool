import React, { Component } from 'react';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import { FormGroup, InputGroup, FormControl, Glyphicon} from 'react-bootstrap';

import Loading from '../resources/Rolling.gif';

//import searchComponent

class InputGraphPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchInput: ''
        };
    }

    render() {

        const inputArray = this.props.inputArray;
        const selectInputFunction = this.props.onClick;
        const selectedInput = this.props.selectedInput;
        const searchInputFunction = this.props.onSearch;
        const suggestion = this.props.suggestion;
        const input = this.state.searchInput;
        const isLoading = this.props.isLoading;
        const emptyContainerMessage = this.props.emptyContainerMessage;

        function handleNoResultsFound(){
            if(input && input.length > 0){
                if(suggestion.length === 0){
                    return 'error';
                }
            }
        };

        let list = []
        let containerArray = (suggestion.length > 0) ? suggestion : inputArray;

        if(containerArray.length > 0){
            containerArray.forEach(input => {
                let listItem;
                if (input.id === selectedInput.id){
                    listItem = ( <ListGroupItem onClick={() => selectInputFunction(input)} active>{input.nom}</ListGroupItem> )
                    list.unshift(listItem);
                }
                else {
                    listItem = ( <ListGroupItem onClick={() => selectInputFunction(input)}>{input.nom}</ListGroupItem> )
                    list.push(listItem);
                }
            });
        }
        else{
            let listItem;
            if(isLoading){
                listItem = (
                    <ListGroupItem>
                        <img className="loading-gif" src={Loading} alt="" />
                    </ListGroupItem>
                )
            }
            else {
                listItem = (
                    <ListGroupItem>
                        {emptyContainerMessage}
                    </ListGroupItem> );
            }
            list.push(listItem);
        }

        return (
            <div className="input-panel">
                <FormGroup
                    controlId="formBasicText"
                    validationState={handleNoResultsFound()}
                >
                    <InputGroup>
                        <FormControl
                            type="text"
                            placeholder={this.props.searchPlaceholder}
                            onChange={e => {
                                this.setState({searchInput: e.target.value});
                                searchInputFunction(e.target.value);
                            }} />
                        <InputGroup.Addon>
                            <Glyphicon glyph="search" />
                        </InputGroup.Addon>
                    </InputGroup>
                </FormGroup>
                <ListGroup className="inputs-container">
                    {list}
                </ListGroup>
            </div>
        );

    };

};

export default InputGraphPanel;
