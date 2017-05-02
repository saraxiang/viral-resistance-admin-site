import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import ParentNode from './ParentNode';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';


class ExistingArticles extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownSelected: 0,
    };
    this.handleDropdown = this.handleDropdown.bind(this);
    this.handleTemplateChange = this.handleTemplateChange.bind(this);
    this.handleCreateTree = this.handleCreateTree.bind(this);
  }

  handleDropdown(event, index, value) { 
    this.setState({"dropdownSelected": value});
  }

  handleTemplateChange(event, newValue) {
    this.props.onTemplateChange(newValue, this.props.template1Indices[this.state.dropdownSelected]);
  }

  handleCreateTree() {
    this.props.onCreateTree(this.props.template1Indices[this.state.dropdownSelected]);
  }

  render() {
    // note here we can assume template1Articles has length at least 1, otherwise this component won't be rendered by Main
    const activeArticle = this.props.template1Articles[this.state.dropdownSelected]; 
    const template = activeArticle.template.p1;
    const dropdownOptions = this.props.template1Articles.map((article, count) => {
      return  <MenuItem 
                key={article.name} 
                value={count} 
                primaryText={article.name} 
              />
    });
    // note here we NEED TO ASSUME that every tree for any article starts with a parent node (that node can have just one child that is a leaf, but it needs at least a child)
    // also note that not planning to support reordering of trees (will always be based on order of occurence in the template), so using order as key is fine
    const trees = activeArticle.trees.map((tree, i) => {
      return  <ParentNode 
                onPromptChange={this.props.onPromptChange} 
                onChoiceChange={this.props.onChoiceChange}
                onCreateChoice={this.props.onCreateChoice} 
                onDeleteChoice={this.props.onDeleteChoice}
                onBranch={this.props.onBranch} 
                onDeleteParent={this.props.onDeleteParent} 
                path={[]} 
                content={tree} 
                key={i} 
                articleNum={this.props.template1Indices[this.state.dropdownSelected]} 
                treeNum={i}
                numChoices={tree.choices.length}
                isRoot={true}
                numTrees={activeArticle.trees.length}
                onDeleteTree={this.props.onDeleteTree}
              />;
    });

    return (
      <div>
        <SelectField
          floatingLabelText="Existing Article Name"
          value={this.state.dropdownSelected}
          onChange={this.handleDropdown}
        >
          {dropdownOptions}
        </SelectField>
        <br />
        <TextField
          value={template}
          floatingLabelText="Template"
          multiLine={true}
          fullWidth={true}
          onChange={this.handleTemplateChange}
        />
        {trees}
        <RaisedButton 
          onTouchTap={this.handleCreateTree} 
          label="Create New Tree" 
          primary={true} 
          style={{"margin": "10px"}}/>
      </div>
    );
  }
}

export default ExistingArticles;
