import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import {Card, CardText} from 'material-ui/Card';

class LeafNode extends Component {
	constructor(props) {
		super(props);

		this.handleChoiceChange = this.handleChoiceChange.bind(this);
	}
	handleChoiceChange(event, newValue) {
		console.log("in leaf, path: " + this.props.path);
		console.log("in leaf, articleNum: " + this.props.articleNum);
		console.log("in leaf, treeNum: " + this.props.treeNum);
		this.props.onChoiceChange(newValue, this.props.path, this.props.articleNum, this.props.treeNum);
	}
	render() {
		return (
		<Card>
		  	<CardText style={{"padding": "8px", "margin": "8px",}}>
		  	<TextField
		      value={this.props.content.text}
		      floatingLabelText="Choice"
		      multiLine={true}
		      onChange={this.handleChoiceChange}
		    />
			</CardText>
		</Card>
		);
	}
}

export default LeafNode;

	