
var React = require('react');
var ReactDOM = require('react-dom');
import {HashRouter as Router,Route} from 'react-router-dom';

// import hashHistory from 'history'
// const history = hashHistory;
import Home from './js/containers/Home';
export default class Root extends React.Component {
  render() {

    return (
      <Router>
        <div>
          <Route exact path="/" component={Home}/>
        </div>
      </Router>
    )
  }
}

ReactDOM.render(<Root/>, document.getElementById('main'));
