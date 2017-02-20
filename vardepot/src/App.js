import React, { Component } from 'react';
import ReactBootstrap from 'react-bootstrap';
import { Button, Navbar, NavItem, Nav, MenuItem, NavDropdown } from 'react-bootstrap';
import { ButtonToolbar, FormGroup, FormControl, Table} from 'react-bootstrap';
import { ButtonGroup } from 'react-bootstrap';
import logo from './logo.svg';
import './App.css';

class App extends Component {
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
			<div className="Gene-search-box">
			  <GeneSearchBox />
			</div>
          </div>
	      <div>
			<VariantQuery />
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
          <NavItem eventKey={1} href="#">Variants</NavItem>
          <NavItem eventKey={2} href="#">Gene Disease Map</NavItem>
          <NavDropdown eventKey={3} title="Dropdown" id="basic-nav-dropdown">
            <MenuItem eventKey={3.1}>Action</MenuItem>
            <MenuItem eventKey={3.2}>Another action</MenuItem>
            <MenuItem eventKey={3.3}>Something else here</MenuItem>
            <MenuItem divider />
            <MenuItem eventKey={3.3}>Separated link</MenuItem>
          </NavDropdown>
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


function GeneSearchBox(props) {
  return (
    <Navbar>
      <Navbar.Header>
        <Navbar.Brand>
          <a href="#">Search for Genes</a>
        </Navbar.Brand>
        <Navbar.Toggle />
      </Navbar.Header>
      <Navbar.Collapse>
        <Navbar.Form pullLeft>
          <FormGroup>
            <FormControl type="text" placeholder="Search" />
          </FormGroup>
          {' '}
          <Button type="submit">Submit</Button>
        </Navbar.Form>
      </Navbar.Collapse>
    </Navbar>
  );
}

     
class VariantQuery extends React.Component {
    constructor() {
        super();
        this.state = { variants: [] };
    }

    componentDidMount() {
	  this.setState( {variants: [1,2,3,4,5,6]})
      var that = this;

	  fetch('/variants')
	    .then(  
	      function(response) {  
			  return response.json();
	      }  
	    )  
		.then(
           function(data) {
			that.setState({ variants: data });
		   }
	   )
	}

  render() {
      return (
          <div class="container">
			  <Table hover bordered condensed>
              <thead>
              <tr>
                <th>ID</th>
                <th>chrom</th>
                <th>pos</th>
                <th>ref</th>
                <th>alt</th>
              </tr>
              </thead>
              <tbody>
                {
                   this.state.variants.map(
                     variant => {return <tr><td>{variant[0]}</td><td>{variant[1]}</td><td>{variant[2]}</td><td>{variant[3]}</td><td>{variant[4]}</td></tr>})
                }
              </tbody>
            </Table>
          </div>
      );
  }
}







class LinkBar extends React.Component {
	renderLink(url, name) {
		return <IconLink url={url} name={name}/>;
	}
	render() {
	  return (
	    <ButtonGroup justified>
		  {this.renderLink("http://www.google.com","Google")}
		  {this.renderLink("http://www.bbc.co.uk/news", "BBC News")}
		  {this.renderLink("http://www.icr.ac.uk", "ICR")}
		</ButtonGroup>
	  );
	}
}


class IconLink extends React.Component {
	render() {
		return (
		<Button bsStyle="primary" bsSize="large" href={this.props.url}>
            {this.props.name}
        </Button>
		);
	}
}


function Square(props) {
  console.log('This works!');
  return (
      <button className="square" onClick={() => props.onClick()}>
		{props.value}
      </button>
  );
}

class Board extends React.Component {
  constructor() {
    super();
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true,
	}
  }
  handleClick(i) {
    const squares = this.state.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
	}
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      squares: squares,
      xIsNext: !(this.state.xIsNext),
    });
  }

  renderSquare(i) {
    return <Square value={this.state.squares[i]} onClick={() => this.handleClick(i)} />;
  }

  render() {
    const winner = calculateWinner(this.state.squares);
    let status;

    if (winner) {
      status = 'Winner: ' + winner;
	} else {
	  status = 'Next player: ' + (this.state.xIsNext ? 'X' :'O');
	}

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}


export default App;
