import React, { Component } from "react";
import { Form, Button, Message, Segment, Input, Label, Card } from "semantic-ui-react";
import { connect } from "react-redux";
import { newArgument } from "../redux/actions";
import { Router } from "../routes";
import Topic from "../ethereum/topic";
import web3 from "../ethereum/web3";
import { logEvent } from "../helpers/analytics.js";

class VoteForm extends Component {
  state = {
    errorMessage: "",
    data: {
      ether: 0.0,
      reputation: 0,
      account: ""
    },

    loading: false
  };

  onFormSubmit = async event => {
    console.log("[VoteForm.js] Topic Address:", this.props);
    var { minimumInvestment, topicAddress, argumentIndex } = this.props;
    const { ether, reputation } = this.state.data;
    const wei = parseInt(web3.utils.toWei(String(ether), "ether"));

    minimumInvestment = parseInt(minimumInvestment); // Ensure this is a number
    event.preventDefault();

    //TODO: Double confirmation button OR Popup https://react.semantic-ui.com/modules/popup/
    this.setState({ loading: true });
    try {
      if (minimumInvestment < 0) {
        throw new Error("Critical Issue: Minimim investment < 0?");
      } else if (wei < minimumInvestment) {
        throw new Error(
          `You must contribute at least ${web3.utils.fromWei(
            minimumInvestment,
            "ether"
          )} ether`
        );
      } else if (reputation < 0) {
        throw new Error("Cannot invest negative reputation.");
      }

      // Attempt to vote for an argument.
      const accounts = await web3.eth.getAccounts();
      const topicContract = Topic(topicAddress);
      await topicContract.methods.vote(argumentIndex, reputation).send({
        from: accounts[0],
        value: wei + 230000000000000 // 5 cents
      });

      logEvent("Vote", "User Voted", wei, this.props.selectedAccount);
      if (this.props.onFormSubmit != null) this.props.onFormSubmit();
      Router.push(`/topics/${topicAddress}`);
      
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false });
  };

  render() {
    const { ether, reputation, account } = this.state.data;
    const { minimumInvestment } = this.props;
    return (
      <React.Fragment>

            <Card header={'How it works'} color='green' description={<div>
              <br></br>
              <b>Ether:</b> The more ether you pay during the voting phase, the more ether you'll get when claiming
              <br/>
              <br/>
              <b>Reputation:</b> Add more reputation to influence other users to taking your side.
            </div>}>
              
            </Card>


      <Segment raised>
        <Form onSubmit={this.onFormSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <b>Voting Details</b>
          </Form.Field>
          <Form.Field>
            <Message warning>
            {`Minimum ETH required to vote: ${
                minimumInvestment
                  ? web3.utils.fromWei(minimumInvestment, "ether")
                  : "INVALID"
              }` + ' (+5 US cents)'}
            </Message>
            <Input
              fluid
              required
              label='Ether'
              labelPosition="right"
              placeholder="How much are you willing to bet?"
              type="number"
              value={ether}
              onChange={event => {
                this.setState({
                  data: {
                    ...this.state.data,
                    ether: parseFloat(event.target.value)
                  }
                });
              }}
            ></Input>
          </Form.Field>
          <Form.Field>
            <Input
              fluid
              required
              label="Reputation"
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
          {/* <Button secondary>Check Potential Reward</Button>

          <Label.Group>
                 {
                  topic.monetarygain && <Label color="green" size='big'>
                  {`Potential Reward: ≈$${ethToUSD(topic.monetarygain)}`}
                  </Label>
                }
          </Label.Group> */}

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
      </React.Fragment>

    );
  }
}

export default VoteForm;
