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
    initialTopicValue: "",
    errorMessage: "",
    loading: false
  };

  onSubmit = async event => {
    event.preventDefault();
    //TODO: Double confirmation button OR Popup https://react.semantic-ui.com/modules/popup/
    try {
      // Start the loading circle and reset the error message
      this.setState({ loading: true, errorMessage: "" });

      // Retrieve user accounts and create a new campaign using the CampaignFactory
      const accounts = await web3.eth.getAccounts();
      if (accounts.length == 0) {
        throw "No available accounts.";
      }

      await factory.methods
        .createTopic(
          this.state.topicContent,
          this.state.minimumInvestment,
          this.state.hoursAvailable
        )
        .send({
          from: accounts[0],
          value: web3.utils.toWei(this.state.initialTopicValue, "ether")
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
          <Form.Input
            error={{
              content: "Please enter your the topic",
              pointing: "below"
            }}
            fluid
            label="Topic"
            placeholder="What should be discussed?"
            type="string"
            value={this.state.topicContent}
            onChange={event => {
              this.setState({ topicContent: event.target.value });
            }}
          />
          <Form.Input
            fluid
            label="Minimum Investment per Voter (wei)"
            placeholder="How much should each person be required to invest in order to partipate?"
            type="number"
            value={this.state.minimumInvestment}
            onChange={event => {
              this.setState({ minimumInvestment: event.target.value });
            }}
          />
          <Form.Input
            fluid
            label="Active Time (Hours)"
            placeholder="How long should the voting last?"
            type="number"
            value={this.state.hoursAvailable}
            onChange={event => {
              this.setState({ hoursAvailable: event.target.value });
            }}
          />
          <Form.Input
            fluid
            label="Initial Topic Value (ether)"
            labelPosition="right"
            placeholder="How much do you want to invest in this topic? (Entice more users to participate)"
            type="number"
            value={this.state.initialTopicValue}
            onChange={event => {
              this.setState({ initialTopicValue: event.target.value });
            }}
          />

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
