import React, { Component } from 'react';
import ReactBootstrap from 'react-bootstrap';
import { Router, Route, browserHistory, hashHistory, Link } from 'react-router';
import { Button, Navbar, NavItem, Nav, MenuItem, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { ButtonToolbar, FormGroup, FormControl, Table, Form, ControlLabel, HelpBlock, Label, Select} from 'react-bootstrap';
import { ButtonGroup } from 'react-bootstrap';
import { GenesPage } from './pages/genes';
import { VariantsPage } from './pages/variants';
import { CSNPage } from './pages/csn';
import logo from './logo.svg';
import './App.css';

{/*import {BrowserRouter as Router} from 'react-router-dom'*/}


class Home extends Component {
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
			<div className="Navigation-bar">
			  <NavigationBar />
			</div>
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


class App extends Component {
  render() {
    return (
		<Router history={browserHistory}>
		  <Route path="/" component={Home} />
		  <Route path="/variants" component={VariantsPage} />
		</Router>
    );
  }
}

export default App;
