import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import Context from './Context';
import LeafNode from './LeafNode';
import {Card, CardText} from 'material-ui/Card';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentClear from 'material-ui/svg-icons/content/clear';

// ParentNode needs to know: 
// whether "text" exists aka whether it was generated as a result of a choice prior
// children and their types
class ParentNode extends Component {
  constructor(props) {
    super(props);
    
    this.handleChoiceChange = this.handleChoiceChange.bind(this);
    this.handleCreateChoice = this.handleCreateChoice.bind(this);
    this.handleDeleteChoice = this.handleDeleteChoice.bind(this);
  }
  handleChoiceChange(event, newValue) {
    console.log("in parent, path: " + this.props.path);
    console.log("in parent, articleNum: " + this.props.articleNum);
    console.log("in parent, treeNum: " + this.props.treeNum);
    this.props.onChoiceChange(newValue, this.props.path, this.props.articleNum, this.props.treeNum);
  }
  handleCreateChoice() {
    this.props.onCreateChoice(this.props.path, this.props.articleNum, this.props.treeNum);
  }
  handleDeleteChoice() {
    this.props.onDeleteChoice(this.props.path, this.props.articleNum, this.props.treeNum);
  }
  render() {
    const content = this.props.content;
    const text = content.text;
    const prompt = content.context.prompt;
    const path = this.props.path;
    const moreThanOneChoice = this.props.numChoices > 1;

    // TODO: it would be better if key was not dependent on order, but rather
    // each node created and saved its on unique key upon 'will mount'
    // but may be overkill for this project 
    const children = content.choices.map((child, order) => {
      if (child.choices) {
        // TODO: for some reason when you indent before <ParentNode the node no longer is returned...
        return  <ParentNode 
                  onPromptChange={this.props.onPromptChange} 
                  onChoiceChange={this.props.onChoiceChange} 
                  onCreateChoice={this.props.onCreateChoice} 
                  onDeleteChoice={this.props.onDeleteChoice} 
                  key={path.concat(order)} 
                  path={path.concat(order)} 
                  content={child} 
                  articleNum={this.props.articleNum} 
                  treeNum={this.props.treeNum}
                  numChoices={this.props.content.choices.length}
                />; 
      }
      return  <LeafNode 
                onChoiceChange={this.props.onChoiceChange} 
                onDeleteChoice={this.props.onDeleteChoice}
                key={path.concat(order)}
                path={path.concat(order)} 
                content={child} 
                articleNum={this.props.articleNum} 
                treeNum={this.props.treeNum}
                numChoices={this.props.content.choices.length}
              />;
    });

    return (
      <div className="parent-node-wrapper">
        {text && 
          <Card>
              {moreThanOneChoice && <FloatingActionButton 
                mini={true} 
                onTouchTap={this.handleDeleteChoice}
                secondary={true} 
                style={{"margin": "4px"}}
              >
                <ContentClear />
              </FloatingActionButton>}
              <CardText>
              <TextField
                  value={text}
                  floatingLabelText="Choice"
                  multiLine={true}
                  onChange={this.handleChoiceChange}
                />
            </CardText>
          </Card>
        }
        <div>
          <div className="tree-level-wrapper">
            <Context 
              onPromptChange={this.props.onPromptChange} 
              path={path} 
              prompt={prompt}
              articleNum={this.props.articleNum} 
              treeNum={this.props.treeNum}
            />
            {children}
            <div className="create-child">
              <FloatingActionButton 
                onTouchTap={this.handleCreateChoice}
                secondary={true} 
                style={{"marginTop": "10px"}}
              >
                <ContentAdd />
              </FloatingActionButton>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ParentNode;