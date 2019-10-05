import * as React from 'react';
import { Header } from './Header';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Docs } from './Docs';
import { Home } from './Home';

export class App extends React.PureComponent {
  componentDidMount() {
    window.addEventListener('onpopstate', e => {
      console.log(e);
    });
  }
  render() {
    return (
      <Router>
        <div className="wrapper">
          <Header />
          <Route exact path="/" component={Home} />
          <Route path="/docs" component={Docs} />
        </div>
      </Router>
    );
  }
}
