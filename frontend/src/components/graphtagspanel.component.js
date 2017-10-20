import React, { Component } from 'react';
import { Col, Row } from 'react-bootstrap';
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
                <Col className="no-left-padding" xs={4}>
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
                </Col>
                <Col className="no-right-padding" xs={8}>
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
                </Col>
            </div>
        );
    }
}

export default GraphTagsPanel;
