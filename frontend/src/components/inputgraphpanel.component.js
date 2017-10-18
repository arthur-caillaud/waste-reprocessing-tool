import React, { Component } from 'react';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import { FormGroup, InputGroup, FormControl, Glyphicon} from 'react-bootstrap';

//import searchComponent

class InputGraphPanel extends Component {

    render() {

        let inputArray = this.props.inputArray;
        let onClickFunction = this.props.onClickFunction;

        let list = []
        inputArray.forEach(input => {
            let listItem = ( <ListGroupItem onClick={onClickFunction}>{input.nom}</ListGroupItem> )
            list.push(listItem);
        })
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
      )
  };

}

export default InputGraphPanel;
