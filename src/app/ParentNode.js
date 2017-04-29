import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import Context from './Context';
import LeafNode from './LeafNode';
import {Card, CardText} from 'material-ui/Card';

// ParentNode needs to know: 
// whether "text" exists aka whether it was generated as a result of a choice prior
// children and their types
class ParentNode extends Component {
  constructor(props) {
    super(props);
    
    this.handleChoiceChange = this.handleChoiceChange.bind(this);
  }
  handleChoiceChange(event, newValue) {
    this.props.onChoiceChange(newValue, this.props.path);
  }
  render() {
    const content = this.props.content;
    const text = content.text;
    const prompt = content.context.prompt;
    const path = this.props.path;

    // TODO: it would be better if key was not dependent on order, but rather
    // each node created and saved its on unique key upon 'will mount'
    // but may be overkill for this project 
    const children = content.choices.map((child, order) => {
      if (child.choices) {
        return <ParentNode onChoiceChange={this.props.onChoiceChange} key={path.concat(order)} path={path.concat(order)} content={child} />; 
      }
      return <LeafNode key={path.concat(order)}/>;
    });

    return (
      <div className="parent-node-wrapper">
        {text && 
          <Card>
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
            <Context prompt={prompt}/>
            {children}
          </div>
        </div>
      </div>
    );
  }
}

export default ParentNode;