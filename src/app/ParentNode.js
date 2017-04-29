import React, {Component} from 'react';
import TextField from 'material-ui/TextField';


// ParentNode needs to know: 
// whether "text" exists aka whether it was generated as a result of a choice prior
// children and their types
class ParentNode extends Component {
  render() {
    const content = this.props.content;
    const text = content.text;

    return (
      <div>
        {text && 
          <div className="card full-width">
            <div className="card-content">
              <TextField
                floatingLabelText={text}
              />
            </div>
          </div> 
        }
        <h1> For now this needs to be here so that nothing isn't returned </h1>
      </div>
    );
  }
}

export default ParentNode;