import React, { Component } from "react";
import { Router } from "../routes";
import factory from "../ethereum/topicFactory";
import web3 from "../ethereum/web3";
import { connect } from "react-redux";

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
import { approximateTimeTillDate } from "../helpers/date";

class TopicSummary extends Component {
  state = {
    loading: false,
    errorMessage: ""
  };

  renderTopicCardGroup() {
    const { days, hours, minutes } = approximateTimeTillDate(
      this.props.endDate
    );

    const items = [
      {
        header: `Min Investment per User: ${this.props.minimumInvestment} ether`,
        description:
          "This is the minimum amount of ether a user needs to contribute in order to contribute to this Topic. It serves as a barrier to entry for users. Increasing this value encourages users to perform a better investigation on the subject prior to voting.",
        meta: "How confident should a user be prior to participating?"
      },
      {
        header: `Ends ${this.props.endDate}`,
        description: "How long should users be able to contribute to this?",
        meta: `Uptime: ${days} Days ${hours} Hours ${minutes} Minutes`
      }
    ];

    return <Card.Group itemsPerRow={2} centered items={items} stackable />;
  }

  renderBillingCardGroup() {
    const items = [
      {
        header: `Selected Account: ${this.props.selectedAccount}`,
        description:
          "The account that will author this Topic. Any initial investment will be from this account.",
        meta: "Did you make sure to select the correct account?"
      },
      {
        header: `Initial Topic Value: ${this.props.initialTopicValue} Ether`,
        description:
          "Initial monetary investment by you to entice other users to participate. With a higher initial topic value, users will be encouraged to act in the same way as the majority (find the truth).",
        meta: "How much is this information worth to you?"
      }
    ];

    return <Card.Group itemsPerRow={2} centered items={items} stackable />;
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
          <span>Your Topic</span>
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

      var totalSeconds = Math.floor(
        Math.abs(this.props.endDate - new Date()) / 1000
      );

      const commission = 0.00025;
      await factory.methods
        .createTopic(
          this.props.topicContent,
          web3.utils.toWei((parseFloat(this.props.minimumInvestment)+commission).toString(), "ether") ,
          totalSeconds
        )
        .send({
          from: this.props.selectedAccount,
          value: web3.utils.toWei(this.props.initialTopicValue + commission, "ether") 
        });
      Router.push("/");
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
  console.log("[Topic Summary] New Topic state: ", state.newTopic);
  console.log("[Topic Summary] Billing state: ", state.billing);
  return { ...state.newTopic, ...state.billing };
};

export default connect(mapStateToProps)(TopicSummary);
