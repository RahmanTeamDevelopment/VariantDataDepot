import React from 'react';
import { FormGroup, FormControl, Form, ControlLabel, HelpBlock} from 'react-bootstrap';


class CSNPage extends React.Component {
  constructor() {
    super();
    this.state = {value: ''};
  }

  getValidationState() {
    const length = this.state.value.length;
    if (length > 10) return 'Valid';
    else if (length > 5) return 'Not sure';
    else if (length > 0) return 'Invalid';
  }

  handleChange(e) {
    this.setState({ value: e.target.value });
  }

  render() {
    return (
      <Form>
        <FormGroup controlId="formBasicText" validationState={this.getValidationState()}>
          <ControlLabel>
            Working example with validation
          </ControlLabel>
          <FormControl type="text" value={this.state.value} placeholder="Enter text" onChange={this.handleChange}/>
          <FormControl.Feedback />
          <HelpBlock>Validation is based on string length.</HelpBlock>
        </FormGroup>
      </Form>
    );
  }
}


export default CSNPage;
