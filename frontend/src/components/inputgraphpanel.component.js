import React, { Component } from 'react';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import { FormGroup, InputGroup, FormControl, Glyphicon} from 'react-bootstrap';

//import searchComponent

class InputGraphPanel extends Component {

    render() {

        const inputArray = this.props.inputArray;
        const onClick = this.props.onClick;
        const selectedInput = this.props.selectedInput;

        let list = []

        if(inputArray){
            inputArray.forEach(input => {
                let listItem;
                if (input === selectedInput){
                    listItem = ( <ListGroupItem onClick={onClick} active>{input.nom}</ListGroupItem> )
                }
                else {
                    listItem = ( <ListGroupItem onClick={onClick}>{input.nom}</ListGroupItem> )
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
                <ListGroup>
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
