import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import LeafNode from './LeafNode';
import ParentNode from './ParentNode';


class Main extends Component {

  render() {
  	const node1 = {text: "hello there"};
  	const node2 = {};
    return (
      <div>
      	<LeafNode />
      	<div className="parent-node-wrapper">
        	<ParentNode content={node1} />
        	<ParentNode content={node2} />
        </div>
      </div>
    );
  }
}

export default Main;
