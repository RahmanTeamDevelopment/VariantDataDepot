import React from 'react';
import { IndexRoute, Router, Route, browserHistory, hashHistory } from 'react-router';
import { Navbar, NavItem, Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import GenesPage from './pages/genes';
import VariantsPage from './pages/variants';
import CSNPage from './pages/csn';
import NotFound from './pages/NotFound';
import logo from './logo.svg';
import './App.css';


class Home extends React.Component {
  render() {
    return (
	  <div className="parent">
          <div className="App">
            <div className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
              <h2>Welcome to TGMI</h2>
            </div>
            <p className="App-intro">
              A curated database of variants discovered in clinical testing
            </p>
          </div>
		  <div className="Navigation-bar">
			<NavigationBar />
		  </div>
          <div>
          {this.props.children}
          </div>
	  </div>
    );
  }
}


function NavigationBar(props) {
  return (
    <Navbar inverse collapseOnSelect>
      <Navbar.Header>
        <Navbar.Brand>
          <a href="#">TGMI Variant Database</a>
        </Navbar.Brand>
        <Navbar.Toggle />
      </Navbar.Header>
      <Navbar.Collapse>
        <Nav>
          <LinkContainer to="/variants">
            <NavItem eventKey={1}>Variants</NavItem>
          </LinkContainer>
          <LinkContainer to="/genes">
            <NavItem eventKey={2}>Gene Disease Map</NavItem>
          </LinkContainer>
          <LinkContainer to="/csn">
            <NavItem eventKey={3}>CSN Validator</NavItem>
          </LinkContainer>
        </Nav>
        <Nav pullRight>
		  <Navbar.Text>
		    Signed in as:  arimmer
		  </Navbar.Text>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
} 


class App extends React.Component {
  render() {
    return (
		<Router history={hashHistory}>
		  <Route path="/" component={Home}>
		    <Route path="variants" component={VariantsPage} />
		    <Route path="genes" component={GenesPage} />
		    <Route path="csn" component={CSNPage} />
		    <Route path="*" component={NotFound} />
          </Route>
		</Router>
    );
  }
}

export default App;
