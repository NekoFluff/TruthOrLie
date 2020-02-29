import React, { Component } from "react";
import { Router } from "../routes";
import Topic from "../ethereum/topic";
import { connect } from "react-redux";
import web3 from "./../ethereum/web3";
import { logEvent } from "../helpers/analytics.js";

import {
  Grid,
  Segment,
  Form,
  Button,
  Divider,
  Label,
  Card,
  Container,
  Message
} from "semantic-ui-react";

class TopicSummary extends Component {
  state = {
    loading: false,
    errorMessage: ""
  };

  renderTopicCardGroup() {
    const items = [
      {
        header: `You said: ${this.props.isTrue}`,
        description: "Your belief."
      },
      {
        header: `Your argument`,
        description: `"${this.props.argument}"`,
        meta: "Make sure it is a sound argument!"
      }
    ];

    return <Card.Group itemsPerRow={1} centered items={items} stackable />;
  }

  renderBillingCardGroup() {
    const items = [
      {
        header: `Selected Account: ${this.props.selectedAccount}`,
        description: "The account that will author this Argument.",
        meta: "Did you make sure to select the correct account?"
      }
    ];

    return <Card.Group itemsPerRow={1} centered items={items} stackable />;
  }

  renderTopicSummary() {
    return (
      <React.Fragment>
        {this.props.backButtonVisible && (
          <Button
            // style={{ marginBottom: "10px"} }
            primary
            // loading={this.state.loading}
            disabled={this.state.loading}
            onClick={this.props.onBackClick}
          >
            Back
          </Button>
        )}
        <h2>Is this right?</h2>
        <Segment raised>
          <Label
            as="a"
            color="red"
            ribbon
            onClick={this.props.returnToTopicScreen}
          >
            Go Back
          </Label>
          <span>Your Argument</span>
          <Divider></Divider>
          <Container style={{ marginBottom: "20px" }} textAlign="center">
            <b>Truth or Lie?</b>
            <p>"{this.props.topicContent}"</p>
          </Container>

          {this.renderTopicCardGroup()}
        </Segment>
      </React.Fragment>
    );
  }

  renderBillingSummary() {
    return (
      <Segment raised>
        <Label
          as="a"
          color="green"
          ribbon
          onClick={this.props.returnToBillingScreen}
        >
          Go Back
        </Label>
        <span>Billing</span>
        <Divider></Divider>

        {this.renderBillingCardGroup()}
      </Segment>
    );
  }

  onConfirm = async event => {
    event.preventDefault();
    try {
      // Start the loading circle and reset the error message
      this.setState({ loading: true, errorMessage: "" });

      // Retrieve user accounts and create a new campaign using the CampaignFactory
      if (this.props.selectedAccount == "") {
        throw new Error(
          "No account selected. Please go back to the Billing screen and choose an account."
        );
      }
      console.log("Topic Address:", this.props.topicAddress);
      const topic = Topic(this.props.topicAddress);
      await topic.methods
        .createArgument(this.props.argument, this.props.isTrue === "Truth")
        .send({
          from: this.props.selectedAccount
          // value: this.props.initialTopicValue // We don't send money when making an argument
        });
      Router.push(`/topics/${this.props.topicAddress}`);
      logEvent('Argument', 'Created a new Argument', this.props.argument.length || 0, this.props.selectedAccount);

    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
    this.setState({ loading: false });
  };

  render() {
    return (
      <Form onSubmit={this.onConfirm} error={!!this.state.errorMessage}>
        <Grid columns={1} stackable>
          <Grid.Column>{this.renderTopicSummary()}</Grid.Column>

          <Grid.Column>{this.renderBillingSummary()}</Grid.Column>
        </Grid>

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
          style={{ marginTop: "10px" }}
        >
          Confirm
        </Button>
      </Form>
    );
  }
}

const mapStateToProps = state => {
  console.log("[Topic Summary] New Argument state: ", state.newArgument);
  console.log("[Topic Summary] Billing state: ", state.billing);
  return { ...state.newArgument, ...state.billing };
};

export default connect(mapStateToProps)(TopicSummary);
