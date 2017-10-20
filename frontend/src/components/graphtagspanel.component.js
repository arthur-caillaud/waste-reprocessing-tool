import React, { Component } from 'react';
import { Col, Row } from 'react-bootstrap';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import { FormGroup, InputGroup, FormControl, Glyphicon} from 'react-bootstrap';

class GraphTagsPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchContainerClassName: "hidden tags-search-container"
        }
        this.showTagsSearchContainer = this.showTagsSearchContainer.bind(this);
    }

    showTagsSearchContainer(){
        this.setState({searchContainerClassName: "tags-search-container"});
    }

    hideTagsSearchContainer(){
        this.setState({searchContainerClassName: "tags-search-container hidden"});
    }

    render() {

        const tagsArray = this.props.inputArray;
        const addTag = this.props.onTagClick;
        const searchInputFunction = this.props.onSearch;
        const suggestionArray = this.props.suggestionArray;
        const searchInput = this.state.searchInput;
        const isLoading = this.props.isLoading;
        const chosenTagsArray=["Déchet A","Déchet B","Déchet C","Déchet D","Déchet E"];

        /*function handleNoResultsFound(){
            if(input && input.length > 0){
                if(suggestion.length === 0){
                    return 'error';
                }
            }
        };*/

        let list=[]

        for (var i = 0; i < 100; i++) {
            const tagComponent = ( <ListGroupItem href="/">{i}</ListGroupItem>)
            list.push(tagComponent)
        }

        /*if(tagArray){
            tagArray.forEach(tag => {
                const tagComponent = ( <ListGroupItem>{tag}</ListGroupItem>)
                list.push(tagComponent)
            })
        }*/

        return (
            <div className="tag-panel">
                <Col className="no-left-padding no-right-padding" xs={4}>
                    <ListGroup className={this.state.searchContainerClassName}>
                        {list}
                    </ListGroup>
                    <FormGroup>
                        <InputGroup
                            onClick={(e) => this.showTagsSearchContainer()}
                        >
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
                </Col>
                <Col className="no-right-padding" xs={8}>

                </Col>
            </div>
        );
    }
}

export default GraphTagsPanel;
