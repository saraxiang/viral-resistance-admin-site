import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import LeafNode from './LeafNode';
import ParentNode from './ParentNode';


class Main extends Component {
  constructor(props) {
    super(props);
    // This state is pulled from database, and pushed to database upon "save"
    this.state = {
      tree: 
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
        },
    };
    this.handleChoice = this.handleChoice.bind(this);
  }

  // assumptions: tree is object with a "choices" key; path is array that consists of
  // valid indices into "choices" arrays, and has length at least 1
  updateTree(update, tree, path) {
    var choices = tree["choices"];
    if (path.length == 1) {
      choices[path[0]]["text"] = update;
    }
    else {
      choices[path[0]] = this.updateTree(update, choices[path[0]], path.splice(0,1));
    }
    tree["choices"] = choices;
    return tree;
  }

  handleChoice(update, path) {
    console.log('update: ' + update);
    console.log('path: ' + path);
    var tree = Object.assign({}, this.state.tree);
    tree = this.updateTree(update, tree, path);
    this.setState({
      "tree": tree
    });
  }

  render() {
    const isParentNode = this.state.tree.choices ? true : false;

    // we're assuming this.state.tree.text does not exist (because this is root)
  	if (isParentNode) {
  		return <ParentNode onChoiceChange={this.handleChoice} path={[]} content={this.state.tree} />;
  	}
  	return <LeafNode />;
  }
}

export default Main;
