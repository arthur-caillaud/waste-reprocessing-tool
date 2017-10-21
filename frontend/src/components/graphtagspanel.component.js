import React, { Component } from 'react';
import { Col, Row } from 'react-bootstrap';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import { FormGroup, InputGroup, FormControl, Glyphicon} from 'react-bootstrap';

class GraphTagsPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchContainerClassName: "hidden tags-search-container",
            suggestion: []
        }
        this.showTagsSearchContainer = this.showTagsSearchContainer.bind(this);
    }

    showTagsSearchContainer(){
        this.setState({searchContainerClassName: "tags-search-container"});
    }

    hideTagsSearchContainer(){
        this.setState({searchContainerClassName: "tags-search-container hidden"});
    }

    searchInArray(array,value){
        if(value !== '' && value == value.toString()){
            const regEx = new RegExp(value.toString(),'i');
            let foundElementsArray = [];
            if(array){
                array.forEach(el => {
                    if (el.nom.match(regEx)){
                        foundElementsArray.push(el);
                    }
                });
            }
            return foundElementsArray;
        }
        return array;
    }

    render() {

        const id= this.props.id
        const inputArray = this.props.inputArray
        const tagsArray = this.props.tagsArray
        const searchPlaceholder = this.props.searchPlaceholder
        const onTagClick = this.props.onTagClick;
        const onLoaded = this.props.onLoaded;
        const onRemove = this.props.onRemove;
        const isLoading = this.props.isLoading;
        const suggestionArray = this.state.suggestion;
        const input = this.state.searchInput;

        function handleNoResultsFound(){
            if(input && input.length > 0){
                if(suggestionArray.length === 0){
                    return 'error';
                }
            }
        };

        let list = [];
        if(suggestionArray){
            suggestionArray.forEach(tag => {
                const tagComponent = ( <ListGroupItem
                    onClick={(e) => {alert(e.target);this.showTagsSearchContainer();
                    }}>
                        {tag}
                    </ListGroupItem>)
                list.push(tagComponent)
            })
        }

        let chosenTags = [];
        if(tagsArray){
            tagsArray.forEach(dechet => {
                const dechetTag = (
                    <div className="chosen-tag"><span>{dechet.nom}</span><Glyphicon glyph="remove" className="remove-tag-button" onClick={onRemove}/></div>
                )
                chosenTags.push(dechetTag);
            })
        }

        return (
            <div className="tag-panel">
                <Col className="no-left-padding no-right-padding" xs={4}>
                    <ListGroup className={this.state.searchContainerClassName}>
                        {list}
                    </ListGroup>
                    <FormGroup
                        controlId="formBasicText"
                        validationState={handleNoResultsFound()}
                    >
                        <InputGroup
                            onClick={(e) => this.showTagsSearchContainer()}
                        >
                            <FormControl
                                type="text"
                                placeholder={this.props.searchPlaceholder}
                                onChange={e => {
                                    this.setState({searchInput: e.target.value});
                                    this.setState({suggestion: this.searchInArray(inputArray, this.state.searchInput)});
                                }} />
                            <InputGroup.Addon>
                                <Glyphicon glyph="search" />
                            </InputGroup.Addon>
                        </InputGroup>
                    </FormGroup>
                </Col>
                <Col className="no-right-padding" xs={8}>
                    {chosenTags}
                </Col>
            </div>
        );
    }

    componentDidMount() {
        this.props.onLoaded();
    };
}

export default GraphTagsPanel;
