import React, { Component } from 'react';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import { FormGroup, InputGroup, FormControl, Glyphicon} from 'react-bootstrap';

//import searchComponent

class InputGraphPanel extends Component {

    render() {

        const inputArray = this.props.inputArray;
        const selectInputFunction = this.props.onClick;
        const selectedInput = this.props.selectedInput;
        const searchInputFunction = this.props.onSearch;
        const suggestion = this.props.suggestion;

        let list = []
        let containerArray = (suggestion.length > 0) ? suggestion : inputArray;

        if(containerArray){
            containerArray.forEach(input => {
                let listItem;
                if (input.nom === selectedInput){
                    listItem = ( <ListGroupItem onClick={() => selectInputFunction(input.nom)} active>{input.nom}</ListGroupItem> )
                }
                else {
                    listItem = ( <ListGroupItem onClick={() => selectInputFunction(input.nom)}>{input.nom}</ListGroupItem> )
                }
                list.push(listItem);
            });
        }

        return (
            <div className="input-panel">
                <FormGroup>
                    <InputGroup>
                        <FormControl
                            type="text"
                            placeholder={this.props.searchPlaceholder}
                            onChange={e => {searchInputFunction(e.target.value);}} />
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

    componentDidMount() {

        this.props.onLoaded()

    };

};

export default InputGraphPanel;
