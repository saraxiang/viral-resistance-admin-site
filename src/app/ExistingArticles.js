import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import ParentNode from './ParentNode';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';


class ExistingArticles extends Component {
  constructor(props) {
    super(props);
    this.handleTemplateChange = this.handleTemplateChange.bind(this);
    this.handleCreateTree = this.handleCreateTree.bind(this);
    this.handleDeleteArticle = this.handleDeleteArticle.bind(this);
    this.handleDropdownChange = this.handleDropdownChange.bind(this);
  }

  handleTemplateChange(event, newValue) {
    this.props.onTemplateChange(newValue, this.props.template1Indices[this.props.dropdownSelected]);
  }

  handleCreateTree() {
    this.props.onCreateTree(this.props.template1Indices[this.props.dropdownSelected]);
  }

  handleDeleteArticle() {
    this.props.onDeleteArticle(this.props.template1Indices[this.props.dropdownSelected]);
    this.setState({"dropdownSelected": 0});
  }

  handleDropdownChange(event, index, value) {
    this.props.onDropdownChange(value);
  }

  render() {
    // note here we can assume template1Articles has length at least 1, otherwise this component won't be rendered by Main
    const activeArticle = this.props.template1Articles[this.props.dropdownSelected];
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
                articleNum={this.props.template1Indices[this.props.dropdownSelected]} 
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
          value={this.props.dropdownSelected}
          onChange={this.handleDropdownChange}
        >
          {dropdownOptions}
        </SelectField>
        {this.props.numArticles > 1 && <RaisedButton 
          onTouchTap={this.handleDeleteArticle} 
          label="Delete Current Article" 
          primary={true} 
          style={{"margin": "10px"}}
        />}
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
