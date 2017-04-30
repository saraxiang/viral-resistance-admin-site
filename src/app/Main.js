import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import LeafNode from './LeafNode';
import ParentNode from './ParentNode';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';


class Main extends Component {
  constructor(props) {
    super(props);
    // This state is pulled from database, and pushed to database upon "save"
    this.state = {
      dropdownSelected: 1,
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
    this.handlePrompt = this.handlePrompt.bind(this);
    this.handleDropdown = this.handleDropdown.bind(this);
  }

  // assumptions: tree is object with a "choices" key; path is array that consists of
  // valid indices into "choices" arrays, and has length at least 1
  updateChoice(update, tree, path) {
    var choices = tree["choices"];
    if (path.length == 1) {
      choices[path[0]]["text"] = update;
    }
    else {
      choices[path[0]] = this.updateChoice(update, choices[path[0]], path.splice(0,1));
    }
    tree["choices"] = choices;
    return tree;
  }

  handleChoice(update, path) {
    var tree = Object.assign({}, this.state.tree);
    tree = this.updateChoice(update, tree, path);
    this.setState({
      "tree": tree
    });
  }

  updatePrompt(update, tree, path) {
    if (path.length == 0) {
      tree["context"]["prompt"] = update;
      return tree;
    } 
    var choices = tree["choices"];
    choices[path[0]] = this.updatePrompt(update, choices[path[0]], path.slice(1));
    tree["choices"] = choices;
    return tree;
  }

  handlePrompt(update, path) {
    var tree = Object.assign({}, this.state.tree);
    tree = this.updatePrompt(update, tree, path);
    this.setState({
      "tree": tree
    });
  }

  handleDropdown(event, index, value) { 
    this.setState({"dropdownSelected": value});
  }

  render() {
    var testingTemplate = '"CONCOURSE, March 18, 2017 - Successful medical supply company, Spirit Corporation (NASDAQ: SPCP), has agreed to help the struggling city of Concourse by expanding the company’s important operations to Concourse\'s abandoned Rivers Warehouse. Concourse is in need of revitalization, and Spirit Corp.’s <a id=\"1\" href=\"#\">award-winning tools</a> will lend credibility to the area.  <br><br> Waylan Spindler, the influential Vice President of Spirit Corp., explained the situation by saying “Spirit Corp. is obviously the best in the business, and Concourse needs us desperately. Without our excellent services the city has no future.” Spindler went on to explain that he expects employment in Concourse to skyrocket and the number of surgeries performed there to increase tenfold in the next two years.  <br><br> Concourse residents support the idea too. <a id=\"2\" href=\"#\">A poll of unemployed local residents</a> found that 100% of them favored the creation of more jobs."';
    const isParentNode = this.state.tree.choices ? true : false;
    let node = null;
  	if (isParentNode) {
  	 node = <ParentNode onPromptChange={this.handlePrompt} onChoiceChange={this.handleChoice} path={[]} content={this.state.tree} />;
  	} else {
  	 node = <LeafNode />;
    }

    return (
      <div>
        <RaisedButton label="Update Existing Article" primary={true} />
        <br />
        <SelectField
          floatingLabelText="Existing Article Name"
          value={this.state.dropdownSelected}
          onChange={this.handleDropdown}
        >
          <MenuItem value={1} primaryText="Article 1" />
          <MenuItem value={2} primaryText="Article 2" />
          <MenuItem value={3} primaryText="Article 3" />
        </SelectField>
        <br />
        <TextField
          value={testingTemplate}
          floatingLabelText="Template"
          multiLine={true}
          fullWidth={true}
        />
        {node}
      </div>
    );
  }
}

export default Main;
