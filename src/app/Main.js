import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import LeafNode from './LeafNode';
import ParentNode from './ParentNode';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Rebase from 're-base';

var base = Rebase.createClass({
    apiKey: "AIzaSyCnGdZV39hgow--2Yev49Fvt3gS_lcMcxs",
    authDomain: "birdgame-aea72.firebaseapp.com",
    databaseURL: "https://birdgame-aea72.firebaseio.com",
    projectId: "birdgame-aea72",
    storageBucket: "birdgame-aea72.appspot.com",
    messagingSenderId: "229376271005"
});

class Main extends Component {
  constructor(props) {
    super(props);
    // This state is pulled from database, and pushed to database upon "save"
    this.state = {
      dropdownSelected: 0,
      tree: {},
      articles: [],
    };
    this.handleChoice = this.handleChoice.bind(this);
    this.handlePrompt = this.handlePrompt.bind(this);
    this.handleDropdown = this.handleDropdown.bind(this);
  }

  componentDidMount(){
    this.treeRef = base.syncState('tree', {
      context: this,
      state: 'tree',
    });
    this.articlesRef = base.syncState('articles', {
      context: this,
      state: 'articles',
      asArray: true,
    });
  }

  componentWillUnmount(){
    base.removeBinding(this.treeRef);
    base.removeBinding(this.articlesRef);
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
    // TODO: assuming here that we only care about template 1 articles
    const template1Articles = this.state.articles.filter(function(article) {
      return article ? (article.template ? article.template.num == 1 : false) : false;
    });
    const activeArticle = template1Articles[this.state.dropdownSelected]; 
    const template = activeArticle ? activeArticle.template.p1 : "";
    const dropdownOptions = template1Articles.map((article, count) => {
      return <MenuItem key={article.name} value={count} primaryText={article.name} />
    });

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
          {dropdownOptions}
        </SelectField>
        <br />
        <TextField
          value={template}
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
