import React, { Component } from "react";
import CommonPage from "./../../components/CommonPage";
import Topic from "../../ethereum/topic";
import { Card, Grid, Button, Segment } from "semantic-ui-react";
import { Link } from "../../routes";
import InfiniteArgumentsList from "./../../components/InfiniteArgumentsList";
import { timestampToString, timestampToDate } from "../../helpers/date";
import Timer from "./../../components/Timer";
import web3 from "../../ethereum/web3";
import ArgumentCardGroup from "../../components/ArgumentCardGroup";

class TopicDetails extends Component {
  state = {
    currentAccount: "",
    userArgument: ""
  };

  async componentDidMount() {
    try {
      await this.retrieveCurrentAccount();
      await this.retrieveUserArgument();
    } catch (err) {
      console.log("[Topic Details (details.js)] An error has occured:", err);
    }
  }

  static async getInitialProps(props) {
    try {
      const topic = Topic(props.query.address);
      const details = await topic.methods.getDetails().call();
      const text = await topic.methods.content().call();

      // return {
      //   address: props.query.address,
      //   minimumContribution: details["minimumContribution"],
      //   balance: details["balance"],
      //   requestCount: details["requestCount"],
      //   contributorCount: details["contributorCount"],
      //   manager: details["manager"]
      // };
      console.log("Topic Details:", details);
      return {
        address: props.query.address,
        text: text,
        creator: details[0],
        isPublic: details[1],
        minimumInvestment: details[2],
        unixTimestamp: details[3],
        isCompleted: details[4]
      };
    } catch (err) {
      console.log("[Topic Details (details.js)] An error has occured:", err);
    }
  }

  renderMetadata() {
    const {
      address,
      minimumInvestment,
      isCompleted,
      isPublic,
      creator,
      unixTimestamp
    } = this.props;

    const items = [
      {
        header: "Contract Address",
        meta: "The address for this Topic Contract",
        description: address,
        style: { overflowWrap: "break-word" }
      },
      {
        header: "Minimum Investment",
        meta: "Minimum amount a user needs to contribute when participating",
        description: `${minimumInvestment} wei`,
        style: { overflowWrap: "break-word" }
      },
      {
        header: "Completed?",
        meta:
          "If already completed, users may no longer participate in the discussion.",
        description: `${isCompleted}`,
        style: { overflowWrap: "break-word" }
      },
      {
        header: "Public",
        meta:
          "If the Topic has not been made public yet, it is not possible to participate just yet.",
        description: `${isPublic}`,
        style: { overflowWrap: "break-word" }
      },
      {
        header: "Creator",
        meta: "The one who created this Topic.",
        description: `${creator}`,
        style: { overflowWrap: "break-word" }
      },
      {
        header: "Unix Timestamp",
        meta: "At what time/date the discussion ends.",
        description: `${unixTimestamp}`,
        style: { overflowWrap: "break-word" }
      },
      {
        header: "End Date/Time",
        meta: "At what time/date the discussion ends.",
        description: `${timestampToString(unixTimestamp)}`,
        style: { overflowWrap: "break-word" }
      }
    ];
    return (
      <Card.Group>
        {items.map(item => {
          return <Card key={item.header} raised {...item} />;
        })}
      </Card.Group>
    );
  }

  retrieveCurrentAccount = async () => {
    try {
      const accounts = await web3.eth.getAccounts();
      if (accounts == null || accounts.length == 0) {
        return;
      }
      this.setState({ currentAccount: accounts[0] });
    } catch (err) {
      console.log("[Topic Details (details.js)] An error has occured:", err);
    }
  };

  retrieveUserArgument = async () => {
    console.log(
      "[Details.js] Attempting to retrieve user argument. Current Account: ",
      this.state.currentAccount
    );
    try {
      const topic = Topic(this.props.address);
      const argumentIndex = await topic.methods
        .createdArgument(this.state.currentAccount)
        .call();
      if (argumentIndex > 0) {
        const argument = await topic.methods.arguments(argumentIndex).call();
        console.log("[Details.js] User Argument: ", argument);
        this.setState({
          userArgument: argument
        });
      }
    } catch (err) {
      console.log(
        "[Topic Details (details.js)] An error has occured while fetching the user's argument: ",
        err
      );
    }
  };

  // appendList.push({
  //   header: argument["isTrue"] + `  [${argument["voteCount"]} votes]`,
  //   description: argument["content"],
  //   meta: "Posted by: " + argument["creator"],
  //   creator: argument["creator"]
  //   // description: argument,
  // });
  renderUserArgument = () => {
    return (
      <Segment>
        <h4>Your Argument</h4>
        <ArgumentCardGroup
          topicAddress={this.props.address}
          arguments={[
            {
              header:
                this.state.userArgument["isTrue"] +
                `  [${this.state.userArgument["voteCount"]} votes]`,
              description: this.state.userArgument["content"],
              meta: "Posted by: " + this.state.userArgument["creator"],
              creator: this.state.userArgument["creator"]
            }
          ]}
        />
      </Segment>
    );
  };

  render() {
    return (
      <CommonPage>
        <Timer targetDate={timestampToDate(this.props.unixTimestamp)}></Timer>
        <h3>Topic Details</h3>
        <Grid columns={2} divided>
          <Grid.Row>
            <Grid.Column width={11}>
              <Segment>
                <Card
                  fluid
                  raised
                  header={"Topic"}
                  meta={"Is this the Truth or a Lie?"}
                  description={this.props.text}
                  style={{ overflowWrap: "break-word" }}
                />
                {this.state.userArgument == "" ? (
                  <Link route={`/topics/${this.props.address}/arguments/new`}>
                    <a>
                      <Button primary>Make an Argument</Button>
                    </a>
                  </Link>
                ) : (
                  <Button primary disabled>
                    You've already made an argument.
                  </Button>
                )}
              </Segment>
              {this.state.userArgument != "" && this.renderUserArgument()}

              <InfiniteArgumentsList topicAddress={this.props.address} />
            </Grid.Column>

            <Grid.Column width={5}>
              {this.renderMetadata()}
              {/* <ContributeForm address={this.props.address} /> */}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </CommonPage>
    );
  }
}

export default TopicDetails;
