import React, { Component } from "react";
import { Form, Button, Message, Segment, Input } from "semantic-ui-react";
import { connect } from "react-redux";
import { newArgument } from "../redux/actions";
import Topic from "../ethereum/topic";
import web3 from "../ethereum/web3";

class VoteForm extends Component {
  state = {
    errorMessage: "",
    data: {
      wei: 0,
      reputation: 0,
      account: ""
    },

    loading: false
  };

  onFormSubmit = async event => {
    console.log("[VoteForm.js] Topic Address:", this.props);
    var { minimumInvestment, topicAddress, argumentIndex } = this.props;
    const { wei, reputation } = this.state.data;
    minimumInvestment = parseInt(minimumInvestment); // Ensure this is a number
    event.preventDefault();

    //TODO: Double confirmation button OR Popup https://react.semantic-ui.com/modules/popup/
    this.setState({ loading: true });
    try {
      if (minimumInvestment < 0) {
        throw new Error("Critical Issue: Minimim investment < 0?");
      } else if (wei < minimumInvestment) {
        throw new Error(
          `You must contribute at least ${minimumInvestment} wei.`
        );
      } else if (reputation < 0) {
        throw new Error("Cannot invest negative reputation.");
      }

      // Attempt to vote for an argument.
      const accounts = await web3.eth.getAccounts();
      const topicContract = Topic(topicAddress);
      await topicContract.methods.vote(argumentIndex).send({
        from: accounts[0],
        value: wei
      });

      if (this.props.onFormSubmit != null) this.props.onFormSubmit();
      Router.pushRoute(`/topics/${topicAddress}`);
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
    this.setState({ loading: false });
  };

  render() {
    const { wei, reputation, account } = this.state.data;
    const { minimumInvestment } = this.props;
    return (
      <Segment raised>
        <Form onSubmit={this.onFormSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <b>Voting Details</b>
          </Form.Field>
          <Form.Field>
            <Input
              fluid
              required
              label={`Investment (wei) minimum ${minimumInvestment}`}
              labelPosition="right"
              placeholder="How much are you willing to bet?"
              type="number"
              value={wei}
              onChange={event => {
                this.setState({
                  data: {
                    ...this.state.data,
                    wei: parseInt(event.target.value)
                  }
                });
              }}
            ></Input>
          </Form.Field>
          <Form.Field>
            <Input
              fluid
              required
              label="Investment (reputation)"
              labelPosition="right"
              placeholder="Put your reputation at stake."
              type="number"
              value={reputation}
              onChange={event => {
                this.setState({
                  data: {
                    ...this.state.data,
                    reputation: parseInt(event.target.value)
                  }
                });
              }}
            ></Input>
          </Form.Field>
          <Message
            error
            header="Oops! Something went wrong"
            content={this.state.errorMessage}
          />
          <Button
            primary
            style={{ marginBottom: "20px", marginTop: "33px" }}
            floated={"right"}
            loading={this.state.loading}
            disabled={this.state.loading}
          >
            Vote
          </Button>
        </Form>
      </Segment>
    );
  }
}

export default VoteForm;
