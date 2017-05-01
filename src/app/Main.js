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
    this.handleUpdateExisting = this.handleUpdateExisting.bind(this);
    this.handleCreateNew = this.handleCreateNew.bind(this);
    this.handleTemplate = this.handleTemplate.bind(this);
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
    console.log("path in handleChoice:" + path);
    let choices = tree["choices"];
    if (path.length == 1) {
      console.log(choices);
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
    console.log("path in main:" + path);
    let articles = Object.assign({}, this.state.articles);
    articles[articleNum]["trees"][treeNum] = this.updateChoice(update, articles[articleNum]["trees"][treeNum], path);
    this.setState({
      articles: articles,
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

  handlePrompt(update, path, articleNum, treeNum) {
    // TODO: make sure this is the best way to do this
    var articles = Object.assign({}, this.state.articles);
    articles[articleNum]["trees"][treeNum] = this.updatePrompt(update, articles[articleNum]["trees"][treeNum], path);
    this.setState({
      articles: articles,
    });
  }

  handleUpdateExisting() {
    this.setState({
      activeInterface: "updateExisting"
    });
  }

  handleCreateNew() {
    this.setState({
      activeInterface: "createNew"
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
        <RaisedButton onTouchTap={this.handleUpdateExisting} label="Update Existing Article" primary={true} style={{"margin": "10px"}}/>
        <RaisedButton onTouchTap={this.handleCreateNew} label="Create New Article" primary={true} />
        <br />
        {this.state.activeInterface == "updateExisting" && template1Articles.length > 0 && <ExistingArticles onTemplateChange={this.handleTemplate} onPromptChange={this.handlePrompt} onChoiceChange={this.handleChoice} template1Articles={template1Articles} template1Indices={template1Indices}/>}
        {this.state.activeInterface == "createNew" && <CreateNewArticle onTemplateChange={this.handleTemplate} onPromptChange={this.handlePrompt} onChoiceChange={this.handleChoice} />}
      </div>
    );
  }
}

export default Main;
