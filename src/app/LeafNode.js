import React, {Component} from 'react';
import {Card, CardText} from 'material-ui/Card';

function LeafNode() {
  return (
	<Card>
	  	<CardText style={{"padding": "8px", "margin": "8px",}}>
			<p>I am a Leaf</p>
		</CardText>
	</Card>
  );
}

export default LeafNode;
