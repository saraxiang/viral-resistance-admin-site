import React, {Component} from 'react';
import LeafNode from './LeafNode';
import ParentNode from './ParentNode';
import ExistingArticles from './ExistingArticles';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
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
    this.state = {
      articles: [],
      newArticleDialogOpen: false,
      newArticleName: "",
      dropdownSelected: 0,
    };
    this.handleChoice = this.handleChoice.bind(this);
    this.handlePrompt = this.handlePrompt.bind(this);
    this.handleDeleteChoice = this.handleDeleteChoice.bind(this);
    this.handleTemplate = this.handleTemplate.bind(this);
    this.handleCreateChoice = this.handleCreateChoice.bind(this);
    this.handleBranch = this.handleBranch.bind(this);
    this.handleDeleteParent = this.handleDeleteParent.bind(this);
    this.handleCreateTree = this.handleCreateTree.bind(this);
    this.handleDeleteTree = this.handleDeleteTree.bind(this);
    this.handleDeleteArticle = this.handleDeleteArticle.bind(this);
    this.handleNewArticle = this.handleNewArticle.bind(this);
    this.handleCloseCreateNewArticle = this.handleCloseCreateNewArticle.bind(this);
    this.handleNewArticleNameChange = this.handleNewArticleNameChange.bind(this);
    this.handleCreateNewArticle = this.handleCreateNewArticle.bind(this);
    this.handleDropdown = this.handleDropdown.bind(this);
  }

  componentDidMount(){
    this.articlesRef = base.syncState('articles', {
      context: this,
      state: 'articles',
      asArray: true,
    });
  }

  componentWillUnmount(){
    base.removeBinding(this.articlesRef);
  }

  // assumptions: tree is object with a "choices" key; path is array that consists of
  // valid indices into "choices" arrays, and has length at least 1
  updateChoice(update, tree, path) {
    let choices = tree["choices"];
    if (path.length == 1) {
      choices[path[0]]["text"] = update;
    }
    else {
      let newPath = path.slice();
      newPath.splice(0,1);
      choices[path[0]] = this.updateChoice(update, choices[path[0]], newPath);
    }
    tree["choices"] = choices;
    return tree;
  }

  handleChoice(update, path, articleNum, treeNum) {
    let articles = Object.assign({}, this.state.articles);
    articles[articleNum]["trees"][treeNum] = this.updateChoice(update, articles[articleNum]["trees"][treeNum], path);
    this.setState({
      articles: articles,
    });
  }

  branch(tree, path) {
    let choices = tree["choices"];
    if (path.length == 1) {
      choices[path[0]]["context"] = {"prompt": ""};
      choices[path[0]]["choices"] = [{"text": ""}];
    }
    else {
      let newPath = path.slice();
      newPath.splice(0,1);
      choices[path[0]] = this.branch(choices[path[0]], newPath);
    }
    tree["choices"] = choices;
    return tree;
  }

  handleBranch(path, articleNum, treeNum) {
    let articles = Object.assign({}, this.state.articles);
    articles[articleNum]["trees"][treeNum] = this.branch(articles[articleNum]["trees"][treeNum], path);
    this.setState({
      articles: articles,
    });
  }

  updatePrompt(update, tree, path) {
    if (path.length == 0) {
      tree["context"]["prompt"] = update;
      return tree;
    } 
    let choices = tree["choices"];
    let newPath = path.slice();
    newPath.splice(0,1);
    choices[path[0]] = this.updatePrompt(update, choices[path[0]], newPath);
    tree["choices"] = choices;
    return tree;
  }

  handlePrompt(update, path, articleNum, treeNum) {
    // TODO: make sure this is the best way to do this
    var articles = Object.assign({}, this.state.articles);
    articles[articleNum]["trees"][treeNum] = this.updatePrompt(update, articles[articleNum]["trees"][treeNum], path);
    this.setState({
      articles: articles,
    });
  }

  deleteParent(tree, path) {
    if (path.length == 0) {
      let text = tree["text"];
      tree = {"text": text};
      return tree;
    } 
    let choices = tree["choices"];
    let newPath = path.slice();
    newPath.splice(0,1);
    choices[path[0]] = this.deleteParent(choices[path[0]], newPath);
    tree["choices"] = choices;
    return tree;
  }

  handleDeleteParent(path, articleNum, treeNum) {
    let articles = Object.assign({}, this.state.articles);
    articles[articleNum]["trees"][treeNum] = this.deleteParent(articles[articleNum]["trees"][treeNum], path);
    this.setState({
      articles: articles,
    });
  }

  handleDeleteTree(articleNum, treeNum) {
    let articles = Object.assign({}, this.state.articles);
    articles[articleNum]["trees"].splice(treeNum, 1)
    this.setState({
      articles: articles,
    });
  }

  handleDeleteArticle(articleNum) {
    let articles = this.state.articles.slice();
    articles.splice(articleNum, 1);
    this.setState({
      articles: articles,
      dropdownSelected: 0,
    });
  }

  createChoice(tree, path) {
    let choices = tree["choices"];
    if (path.length == 0) {
      choices.push({"text" : ""});
    } 
    else {
      let newPath = path.slice();
      newPath.splice(0,1);
      choices[path[0]] = this.createChoice(choices[path[0]], newPath);
    }
    tree["choices"] = choices;
    return tree;
  }

  handleCreateChoice(path, articleNum, treeNum) {
    let articles = Object.assign({}, this.state.articles);
    articles[articleNum]["trees"][treeNum] = this.createChoice(articles[articleNum]["trees"][treeNum], path);
    this.setState({
      articles: articles,
    });
  }

  handleCreateTree(articleNum) {
    let articles = Object.assign({}, this.state.articles);
    articles[articleNum]["trees"].push({
      "context": {"prompt": ""},
      "choices": [{"text": ""}]
    });
    this.setState({
      articles: articles,
    });
  }

  deleteChoice(tree, path) {
    let choices = tree["choices"];
    if (path.length == 1) {
      choices.splice(path[0], 1);
    }
    else {
      let newPath = path.slice();
      newPath.splice(0,1);
      choices[path[0]] = this.deleteChoice(choices[path[0]], newPath);
    }
    tree["choices"] = choices;
    return tree;
  }

  handleDeleteChoice(path, articleNum, treeNum) {
    let articles = Object.assign({}, this.state.articles);
    articles[articleNum]["trees"][treeNum] = this.deleteChoice(articles[articleNum]["trees"][treeNum], path);
    this.setState({
      articles: articles,
    });
  }

  handleTemplate(update, articleNum) {
    var articles = Object.assign({}, this.state.articles);
    // TODO: assuming template 1 articles only
    articles[articleNum]["template"]["p1"] = update;
    this.setState({
      articles: articles,
    });
  }

  handleNewArticle() {
    this.setState({newArticleDialogOpen: true});
  }

  handleCloseCreateNewArticle() {
    this.setState({
      newArticleDialogOpen: false,
      newArticleName: "",
    });
  }

  handleNewArticleNameChange(obj, newName) {
    this.setState({newArticleName: newName});
  }

  handleCreateNewArticle() {
    let articles = this.state.articles.slice();
    articles.unshift({
      "name": this.state.newArticleName,
      "template": {
        "num": 1,
        "p1": ""
      },
      "trees": [{
        "context": {
          "prompt": ""
        },
        "choices": [{
          "text": ""
        }]
      }]
    });
    this.setState({
      newArticleDialogOpen: false,
      newArticleName: "",
      articles: articles,
      dropdownSelected: 0
    });
  }

  handleDropdown(value) { 
    this.setState({"dropdownSelected": value});
  }

  render() {
    // TODO: assuming here that we only care about template 1 articles
    const articleAndIndex = this.state.articles.map(function(article, i) {
      return {"article": article, "index": i};
    });
    const template1ArticleAndIndex = articleAndIndex.filter(function(obj) {
      return obj.article.template ? obj.article.template.num == 1 : false;
    });
    const template1Indices = template1ArticleAndIndex.map(function(obj) {
      return obj.index;
    });
    const template1Articles = template1ArticleAndIndex.map(function(obj) {
      return obj.article;
    });
    const createNewArticleDialogActions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleCloseCreateNewArticle}
      />,
      <FlatButton
        label="Create"
        primary={true}
        onTouchTap={this.handleCreateNewArticle}
      />,
    ];

    return (
      <div>
        <RaisedButton 
          label="Create New Article" 
          onTouchTap={this.handleNewArticle} 
          primary={true}
        />
        <br />
        {template1Articles.length > 0 && 
          <ExistingArticles 
            onTemplateChange={this.handleTemplate} 
            onPromptChange={this.handlePrompt} 
            onChoiceChange={this.handleChoice} 
            template1Articles={template1Articles} 
            template1Indices={template1Indices}
            onCreateChoice={this.handleCreateChoice}
            onDeleteChoice={this.handleDeleteChoice}
            onBranch={this.handleBranch}
            onDeleteParent={this.handleDeleteParent}
            onCreateTree={this.handleCreateTree}
            onDeleteTree={this.handleDeleteTree}
            onDeleteArticle={this.handleDeleteArticle}
            onDropdownChange={this.handleDropdown}
            numArticles={this.state.articles.length}
            dropdownSelected={this.state.dropdownSelected}
        />}
        <Dialog
          title="Create New Article"
          actions={createNewArticleDialogActions}
          modal={true}
          open={this.state.newArticleDialogOpen}
        >
          <TextField
            value={this.state.newArticleName}
            floatingLabelText="New Article Name"
            multiLine={true}
            fullWidth={true}
            onChange={this.handleNewArticleNameChange}
          />
        </Dialog>
      </div>
    );
  }
}

export default Main;
