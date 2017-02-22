import React from 'react';
import { Button } from 'react-bootstrap';
import { FormGroup, FormControl, Table, Form, Label } from 'react-bootstrap';


class VariantsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {Chromosome: '', StartPos: '', EndPos: '', Variants: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();

    var that = this;

	fetch('/variants')
	  .then(  
	    function(response) {  
	  	  return response.json();
	    }  
	  )  
	  .then(
         function(data) {
	  	that.setState({ Variants: data });
	     }
	 )
  }

  render() {
    return (
	  <div>
      <Form onSubmit={this.handleSubmit}>
		<FormGroup>
          <Label>Chromosome</Label>
          <FormControl name='Chromosome' placeholder="Chrom" onChange={this.handleChange}/>
        </FormGroup>
		<FormGroup>
          <Label>Start Position</Label>
          <FormControl name='StartPos' placeholder="Start Pos" onChange={this.handleChange}/>
        </FormGroup>
		<FormGroup>
          <Label>End Position</Label>
          <FormControl name='EndPos' placeholder="End Pos" onChange={this.handleChange}/>
        </FormGroup>
		<FormGroup>
          <Label>Select Variant Type</Label>
          <select>
            <option>SNPs</option>
            <option>Indels</option>
            <option>All</option>
          </select>
        </FormGroup>
        <Button type="submit" class="btn btn-primary">Find Variants</Button>
      </Form>

      {this.state.Variants && 
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
                 this.state.Variants.map(
                   variant => {return <tr><td>{variant[0]}</td><td>{variant[1]}</td><td>{variant[2]}</td><td>{variant[3]}</td><td>{variant[4]}</td></tr>})
              }
            </tbody>
          </Table>
        </div>
      }
	  </div>
	  );
  }
}


export default VariantsPage;
