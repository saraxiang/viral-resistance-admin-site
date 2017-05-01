import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import {Card, CardTitle, CardText} from 'material-ui/Card';

class Context extends Component {
  constructor(props) {
    super(props);
    
    this.handlePromptChange = this.handlePromptChange.bind(this);
  }
  handlePromptChange(event, newValue) {
    this.props.onPromptChange(newValue, this.props.path, this.props.articleNum, this.props.treeNum);
  }
  render() {
	const prompt = this.props.prompt;
	return (
	<Card>
	  	<CardTitle title="Context" />
	  	<CardText>
			<TextField
				value={prompt}
		      	floatingLabelText="Prompt"
		      	multiLine={true}
		      	onChange={this.handlePromptChange}
		    />
		</CardText>
	</Card>
	);
  }
}

export default Context;
