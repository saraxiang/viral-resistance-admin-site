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
    // TODO: this will ideal not pass 3 parameters, but 2 where the last one
    // is the unique id
    this.props.onChoiceChange(newValue, this.props.depth, this.props.content.text);
  }
  render() {
    const depth = this.props.depth;
    const newDepth = depth + 1;
    const content = this.props.content;
    const text = content.text;
    const prompt = content.context.prompt;
    // TODO: it would be better if key was not dependent on text, but rather
    // each node created and saved its on unique key upon creation
    // this would allow better support of reordering later on, may be
    // overkill for this project though
    // Also here we're assuming all children in each level will have different text,
    // which is a reasonable assumption, but...
    const children = content.choices.map((child) => {
      if (child.choices) {
        return <ParentNode onChoiceChange={this.props.onChoiceChange} key={newDepth + child.text} depth={newDepth} content={child} />; 
      }
      return <LeafNode key={newDepth + child.text}/>;
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