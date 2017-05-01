import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import ParentNode from './ParentNode';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

class CreateNewArticle extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
    this.handleTemplateChange = this.handleTemplateChange.bind(this);
  }

  handleTemplateChange(event, newValue) {
    this.props.onTemplateChange(newValue, this.props.template1Indices[this.state.dropdownSelected]);
  }

  render() {
    return (
      <div>
        <TextField
          value={"New template"}
          floatingLabelText="Template"
          multiLine={true}
          fullWidth={true}
          // onChange={this.handleTemplateChange}
        />
      </div>
    );
  }
}

export default CreateNewArticle;
