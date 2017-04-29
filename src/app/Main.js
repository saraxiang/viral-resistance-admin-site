import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import LeafNode from './LeafNode';
import ParentNode from './ParentNode';


class Main extends Component {

  render() {
  	const tree = 
  	{
      "choices" : [ {
        "choices" : [ {
          "choices" : [ {
            "leaf" : {
              "globalVar" : "someVal"
            },
            "text" : "That's right!"
          }, {
            "text" : "On second thought..."
          } ],
          "context" : {
            "prompt" : "Can't blindly trust this guy. He has a lot to gain by promoting his own company."
          },
          "text" : "...he's biased toward Spirit Corp."
        }, {
          "text" : "...he's wealthy"
        }, {
          "text" : "Go back"
        } ],
        "context" : {
          "prompt" : "I can't trust this author because..."
        },
        "text" : "Nope, something's wrong"
      }, {
        "text" : "Sure, no reason to doubt"
      }, {
        "text" : "Go back"
      } ],
      "context" : {
        "prompt" : "Always consider the source, as they say. Can I trust him?"
      }
    }
    const isParentNode = tree.choices ? true : false;

  	if (isParentNode) {
  		return <ParentNode content={tree} />;
  	}
  	return <LeafNode />;
  }
}

export default Main;
