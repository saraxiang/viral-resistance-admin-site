import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import {Card, CardTitle, CardText} from 'material-ui/Card';

class Context extends Component {
  render() {
	const prompt = this.props.prompt;
	return (
	<Card>
	  	<CardTitle title="Context" />
	  	<CardText>
			<TextField
				defaultValue={prompt}
		      	floatingLabelText="Choice"
		      	multiLine={true}
		    />
		</CardText>
	</Card>
	);
  }
}

export default Context;
