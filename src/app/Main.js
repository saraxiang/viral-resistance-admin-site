import React, {Component} from 'react';
import LeafNode from './LeafNode';
import ParentNode from './ParentNode';
import ExistingArticles from './ExistingArticles';
import CreateNewArticle from './CreateNewArticle';
import RaisedButton from 'material-ui/RaisedButton';
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
      activeInterface: ""
    };
    this.handleChoice = this.handleChoice.bind(this);
    this.handlePrompt = this.handlePrompt.bind(this);
    this.handleUpdateExistingArticle = this.handleUpdateExistingArticle.bind(this);
    this.handleCreateNewArticle = this.handleCreateNewArticle.bind(this);
    this.handleDeleteChoice = this.handleDeleteChoice.bind(this);
    this.handleTemplate = this.handleTemplate.bind(this);
    this.handleCreateChoice = this.handleCreateChoice.bind(this);
    this.handleBranch = this.handleBranch.bind(this);
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

  handleUpdateExistingArticle() {
    this.setState({
      activeInterface: "updateExisting"
    });
  }

  handleCreateNewArticle() {
    this.setState({
      activeInterface: "CreateNewArticle"
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

    return (
      <div>
        <RaisedButton onTouchTap={this.handleUpdateExistingArticle} label="Update Existing Article" primary={true} style={{"margin": "10px"}}/>
        <RaisedButton onTouchTap={this.handleCreateNewArticle} label="Create New Article" primary={true} />
        <br />
        {this.state.activeInterface == "updateExisting" && 
          template1Articles.length > 0 && 
          <ExistingArticles 
            onTemplateChange={this.handleTemplate} 
            onPromptChange={this.handlePrompt} 
            onChoiceChange={this.handleChoice} 
            template1Articles={template1Articles} 
            template1Indices={template1Indices}
            onCreateChoice={this.handleCreateChoice}
            onDeleteChoice={this.handleDeleteChoice}
            onBranch={this.handleBranch}
          />}
        {this.state.activeInterface == "CreateNewArticle" && 
          <CreateNewArticle 
            onTemplateChange={this.handleTemplate} 
            onPromptChange={this.handlePrompt} 
            onChoiceChange={this.handleChoice} 
            onCreateChoice={this.handleCreateChoice}
            onDeleteChoice={this.handleDeleteChoice}
            onBranch={this.handleBranch}
          />}
      </div>
    );
  }
}

export default Main;
