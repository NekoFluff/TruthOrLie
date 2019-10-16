import React, { Component } from "react";
import CommonPage from "../../components/CommonPage";
import NewTopicSteps from "../../components/NewTopicSteps";
import { Router } from "../../routes";
import factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";
import { Form, Button, Input, Message } from "semantic-ui-react";

class NewTopic extends Component {
  state = {
    minimumInvestment: "",
    topicContent: "",
    hoursAvailable: "",
    initialTopicValue: "",
    errorMessage: "",
    topicError: "",
    minimumInvestmentError: "",
    activeTimeError: "",
    initalTopicValueError: "",
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
        throw new Error("No available accounts were found. Please make sure to connect your wallet using Metamask!");
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
        <NewTopicSteps active={1} />
        <h3>Let's talk about something!</h3>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Input
            error={this.state.topicError != "" && {
              content: this.state.topicError,
              pointing: "below"
            }}
            required
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
            error={this.state.minimumInvestmentError != "" && {
              content: this.state.minimumInvestmentError,
              pointing: "below"
            }}
            fluid
            required
            label="Minimum Investment per Voter (wei)"
            placeholder="How much should each person be required to invest in order to partipate?"
            type="number"
            value={this.state.minimumInvestment}
            onChange={event => {
              this.setState({ minimumInvestment: event.target.value });
            }}
          />
          <Form.Input
            error={this.state.activeTimeError != "" && {
              content: this.state.activeTimeError,
              pointing: "below"
            }}
            fluid
            required
            label="Active Time (Hours)"
            placeholder="How long should the voting period last?"
            type="number"
            value={this.state.hoursAvailable}
            onChange={event => {
              this.setState({ hoursAvailable: event.target.value });
            }}
          />
          <Form.Input
            error={this.state.initalTopicValueError != "" && {
              content: this.state.initalTopicValueError,
              pointing: "below"
            }}
            fluid
            required
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
            floated={"right"}
            loading={this.state.loading}
            disabled={this.state.loading}
          >
            Next
          </Button>
        </Form>
      </CommonPage>
    );
  }
}

export default NewTopic;
