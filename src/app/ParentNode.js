import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import Context from './Context';
import LeafNode from './LeafNode';
import {Card, CardText} from 'material-ui/Card';




// ParentNode needs to know: 
// whether "text" exists aka whether it was generated as a result of a choice prior
// children and their types
class ParentNode extends Component {
  render() {
    const content = this.props.content;
    const text = content.text;
    const prompt = content.context.prompt;
    const children = content.choices.map((child) => {
      if (child.choices) {
        return <ParentNode content={child} />; 
      }
      return <LeafNode />;
    });

    return (
      <div className="parent-node-wrapper">
        {text && 
          <Card>
              <CardText>
              <TextField
                  defaultValue={text}
                  floatingLabelText="Choice"
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