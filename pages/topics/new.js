import React, { Component } from "react";
import CommonPage from "../../components/CommonPage";
import { Form, Button, Input, Message } from "semantic-ui-react";
import { Router } from "../../routes";
import factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";

class NewTopic extends Component {
  state = {
    minimumInvestment: "",
    topicContent: "",
    hoursAvailable: "",
    errorMessage: "",
    loading: false
  };

  onSubmit = async event => {
    event.preventDefault();

    try {
      // Start the loading circle and reset the error message
      this.setState({ loading: true, errorMessage: "" });

      // Retrieve user accounts and create a new campaign using the CampaignFactory
      const accounts = await web3.eth.getAccounts();
      await factory.methods.createCampaign(this.state.minimumInvestment).send({
        from: accounts[0]
      });

      Router.pushRoute("/");
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
    this.setState({ loading: false });
  };

  render() {
    return (
      <CommonPage>
        <h3>Let's talk about something!</h3>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Topic</label>
            <Input
              label="Topic"
              labelPosition="left"
              type="string"
              value={this.state.topicContent}
              onChange={event => {
                this.setState({ topicContent: event.target.value });
              }}
            />
            <label>Minimum Investment per Voter</label>
            <Input
              label="wei"
              labelPosition="right"
              type="number"
              value={this.state.minimumInvestment}
              onChange={event => {
                this.setState({ minimumInvestment: event.target.value });
              }}
            />
            <label>Active Time</label>
            <Input
              label="hours"
              labelPosition="right"
              type="number"
              value={this.state.hoursAvailable}
              onChange={event => {
                this.setState({ hoursAvailable: event.target.value });
              }}
            />
          </Form.Field>

          <Message
            error
            header="Oops! Something went wrong"
            content={this.state.errorMessage}
          />
          <Button
            primary
            loading={this.state.loading}
            disabled={this.state.loading}
          >
            Create!
          </Button>
        </Form>
      </CommonPage>
    );
  }
}

export default NewTopic;
