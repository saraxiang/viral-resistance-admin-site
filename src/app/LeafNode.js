import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import {Card, CardText} from 'material-ui/Card';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentClear from 'material-ui/svg-icons/content/clear';
import ContentAdd from 'material-ui/svg-icons/content/add';

class LeafNode extends Component {
	constructor(props) {
		super(props);

		this.handleChoiceChange = this.handleChoiceChange.bind(this);
    	this.handleDeleteChoice = this.handleDeleteChoice.bind(this);
    	this.handleBranch = this.handleBranch.bind(this);
	}

	handleChoiceChange(event, newValue) {
		this.props.onChoiceChange(newValue, this.props.path, this.props.articleNum, this.props.treeNum);
	}

	handleDeleteChoice() {
		this.props.onDeleteChoice(this.props.path, this.props.articleNum, this.props.treeNum);
	}

	handleBranch() {
		this.props.onBranch(this.props.path, this.props.articleNum, this.props.treeNum);
	}

	render() {
	    const moreThanOneChoice = this.props.numChoices > 1;
		return (
		<Card>
			<div className="close-button">
          	{moreThanOneChoice && <FloatingActionButton 
            	mini={true} 
            	onTouchTap={this.handleDeleteChoice}
            	secondary={true} 
          	>
          		<ContentClear />
            </FloatingActionButton>}
            </div>
		  	<CardText style={{"padding": "8px", "margin": "8px",}}>
			  	<TextField
			      value={this.props.content.text}
			      floatingLabelText="Choice"
			      multiLine={true}
			      onChange={this.handleChoiceChange}
			    />
			    <div className="branch-button">
				    <FloatingActionButton 
				    	onTouchTap={this.handleBranch}
		            	mini={true} 
	          		>
	          			<ContentAdd />
	            	</FloatingActionButton>
	            </div>
			</CardText>
		</Card>
		);
	}
}

export default LeafNode;

	