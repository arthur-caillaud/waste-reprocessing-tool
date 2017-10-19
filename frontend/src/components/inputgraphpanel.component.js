import React, { Component } from 'react';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import { FormGroup, InputGroup, FormControl, Glyphicon} from 'react-bootstrap';

//import searchComponent

class InputGraphPanel extends Component {

    render() {

        const inputArray = this.props.inputArray;
        const selectInput = this.props.onClick;
        const selectedInput = this.props.selectedInput;

        let list = []

        if(inputArray){
            inputArray.forEach(input => {
                let listItem;
                if (input.nom === selectedInput){
                    listItem = ( <ListGroupItem onClick={() => selectInput(input.nom)} active>{input.nom}</ListGroupItem> )
                }
                else {
                    listItem = ( <ListGroupItem onClick={() => selectInput(input.nom)}>{input.nom}</ListGroupItem> )
                }
                list.push(listItem);
            });
        }

        return (
            <div className="input-panel">
                <FormGroup>
                    <InputGroup>
                        <FormControl type="text" />
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
