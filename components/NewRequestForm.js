import React, { Component } from 'react';
import { Form, Input, Message, Button } from 'semantic-ui-react';
import Campaign from '../ethereum/campaign';
import web3 from '../ethereum/web3';
import { Router } from '../routes';

class NewRequestForm extends Component {
  state = { 
    errorMessage: '',
    value: '',
    description: '',
    recipient: '',
    loading: false
  }

  onSubmit = async () => {
    event.preventDefault();

    this.setState({ loading: true, errorMessage: '' });
    const campaign = Campaign(this.props.address);
    // console.log('Campaign Address:', this.props.address);
    const { description, value, recipient } = this.state;

    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods
        .createRequest(description, web3.utils.toWei(value, 'ether'), recipient)
        .send({ from: accounts[0] })
      Router.pushRoute(`/campaigns/${this.props.address}/requests`)
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false });
  }

  render() {
    return (
      <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
        <Form.Field>
          <label>Description</label>
          <Input label='description' labelPosition='right' value={this.state.description} onChange={() => {
            this.setState({ description: event.target.value })
          }}/>
        </Form.Field>
        <Form.Field>
          <label>Value in Ether</label>
          <Input label='ether' labelPosition='right' type='number' value={this.state.value} onChange={() => {
            this.setState({ value: event.target.value })
          }}/>
        </Form.Field>
        <Form.Field>
          <label>Recipient</label>
          <Input label='recipient' labelPosition='right' type='address' value={this.state.recipient} onChange={() => {
            this.setState({ recipient: event.target.value })
          }}/>
        </Form.Field>
        <Message error header='Oops! Something went wrong' content={this.state.errorMessage}/>
        <Button primary loading={this.state.loading} disabled={this.state.loading}>Create!</Button>
      </Form>

    );
  }
}
 
export default NewRequestForm;