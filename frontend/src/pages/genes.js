import React from 'react';
import { Navbar, Button, FormGroup, FormControl } from 'react-bootstrap';

class GenesPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {Gene: ''};
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    this.setState({Gene: 'BRCA1'});
    alert("The gene is " + event.target.name);
  }

  render() {
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
            <Button type="submit" onClick={this.handleClick}>Submit</Button>
          </Navbar.Form>
        </Navbar.Collapse>
      </Navbar>

    );
  }
}

export default GenesPage;
