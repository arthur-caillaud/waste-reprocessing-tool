import React, { Component } from 'react';
import { FormGroup, InputGroup, FormControl, Glyphicon} from 'react-bootstrap';

class GraphTagsPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {

        return (
            <div className="tag-panel">
                <FormGroup>
                    <InputGroup>
                        <FormControl
                            type="text"
                            placeholder={this.props.searchPlaceholder}
                            onChange={e => {}} />
                        <InputGroup.Addon>
                            <Glyphicon glyph="search" />
                        </InputGroup.Addon>
                    </InputGroup>
                </FormGroup>
            </div>
        );
    }
}

export default GraphTagsPanel;
