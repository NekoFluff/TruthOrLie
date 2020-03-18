import React, { Component } from "react";
import Topic from "../../ethereum/topic";
import { Card, Grid, Button, Segment, Container } from "semantic-ui-react";
import { Link } from "../../routes";
import InfiniteArgumentsList from "./../../components/InfiniteArgumentsList";
import { timestampToString, timestampToDate } from "../../helpers/date";
import Timer from "./../../components/Timer";
import web3 from "../../ethereum/web3";
import ArgumentCardGroup from "../../components/ArgumentCardGroup";
import { VictoryPie } from "victory";
class TopicDetails extends Component {
  state = {
    currentAccount: "",
    userArgument: ""
  };

  async componentDidMount() {
    console.log("[Topic Details (details.js)] Component Did Mount:");
    try {
      localStorage.setItem("topicText", this.props.text);
      localStorage.setItem(
        "topicMinimumInvestment",
        this.props.minimumInvestment
      );
      await this.retrieveCurrentAccount();
      // console.log("[Topic Details (details.js)] Retrieving User Argument");
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

      const topicDetails = {
        address: props.query.address,
        text: text,
        creator: details[0],
        minimumInvestment: details[1],
        unixTimestamp: details[2],
        isCompleted: details[3],
        canClaim: details[4],
        claimed: details[5],
        etherPool: parseInt(details[6]),
        truthCount: parseInt(details[7]),
        lieCount: parseInt(details[8]),
        truthReputation: parseInt(details[9]),
        lieReputation: parseInt(details[10])
      };
      // console.log("[details.js] Topic Details:", details, topicDetails);

      return topicDetails;
    } catch (err) {
      console.log("[Topic Details (details.js)] An error has occured:", err);
    }
  }

  renderMetadata() {
    const {
      address,
      minimumInvestment,
      isCompleted,
      // isPublic,
      creator,
      unixTimestamp
    } = this.props;
    const minimumInvestmentEth = web3.utils.fromWei(minimumInvestment, "ether")

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
        description: `${minimumInvestmentEth} ETH`,
        style: { overflowWrap: "break-word" }
      },
      {
        header: "Completed?",
        meta:
          "If already completed, the majority has been determined.",
        description: `${isCompleted}`,
        style: { overflowWrap: "break-word" }
      },
      // {
      //   header: "Public",
      //   meta:
      //     "If the Topic has not been made public yet, it is not possible to participate just yet.",
      //   description: `${isPublic}`,
      //   style: { overflowWrap: "break-word" }
      // },
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
      const alreadyVoted =
        (await topic.methods.voted(this.state.currentAccount).call()) != 0;
      const argumentIndex = await topic.methods
        .createdArgument(this.state.currentAccount)
        .call();
      if (argumentIndex > 0) {
        const argument = await topic.methods.arguments(argumentIndex).call();
        // console.log("[Details.js] User Argument: ", argument);
        this.setState({
          userArgument: argument,
          userArgumentIndex: argumentIndex,
          canVote: !alreadyVoted
        });
      }
    } catch (err) {
      console.log(
        "[Topic Details (details.js)] An error has occured while fetching the user's argument: ",
        err
      );
    }
  };

  renderGraphs = () => {
    var numColumns = 2
    if (this.props.isCompleted) {
      numColumns = 2
    }
    return (
      <Grid columns={numColumns} divided>
        <Grid.Row>
          <Grid.Column>
            <Container textAlign="center">
              <h3>Reputation Chart</h3>
              {this.props.lieCount == 0 && this.props.truthCount == 0 ? (
                <p>No one has voted yet.</p>
              ) : (
                <VictoryPie
                  style={{
                    parent: { maxWidth: "100%" },
                    labels: { fill: "white", fontSize: 20, fontWeight: "bold" }
                  }}
                  animate={{ duratiion: 2000 }}
                  colorScale={["#2185d0", "#b21e1e"]}
                  labelRadius={({ innerRadius }) => innerRadius + 35}
                  // startAngle={90}
                  // endAngle={-90}
                  data={[
                    {
                      x: `Truth: ${this.props.truthReputation}`,
                      y: this.props.truthReputation
                    },
                    {
                      x: `Lie: ${this.props.lieReputation}`,
                      y: this.props.lieReputation
                    }
                  ]}
                ></VictoryPie>
              )}
            </Container>
          </Grid.Column>
          {
            this.props.isCompleted && 
          <Grid.Column>
            <Container textAlign="center">
              <h3>Votes Chart</h3>

              {this.props.lieCount == 0 && this.props.truthCount == 0 ? (
                <p>No one has voted yet.</p>
                ) : (
                  <VictoryPie
                  style={{
                    parent: { maxWidth: "100%" },
                    labels: { fill: "white", fontSize: 20, fontWeight: "bold" }
                  }}
                  animate={{ duratiion: 2000 }}
                  colorScale={["#2185d0", "#b21e1e"]}
                  labelRadius={({ innerRadius }) => innerRadius + 35}
                  // style={{ labels: { fontSize: 12, fontWeight: `bold` } }}
                  // startAngle={90}
                  // endAngle={-90}
                  data={[
                    {
                      x: `Truth: ${this.props.truthCount}`,
                      y: this.props.truthCount
                    },
                    { x: `Lie: ${this.props.lieCount}`, y: this.props.lieCount }
                  ]}
                ></VictoryPie>
              )}
            </Container>
          </Grid.Column>
          }

        </Grid.Row>
      </Grid>
    );
  };

  renderUserArgument = () => {
    return (
      <Segment>
        <h4>Your Argument</h4>
        <ArgumentCardGroup
          topicAddress={this.props.address}
          arguments={[
            {
              header:
                (this.state.userArgument["isTrue"] ? "Truth" : "Lie") + `  [${this.state.userArgument["voteCount"]} votes]`,
              description: this.state.userArgument["content"],
              meta: "Posted by: " + this.state.userArgument["creator"],
              creator: this.state.userArgument["creator"],
              argumentindex: this.state.userArgumentIndex,
              canvote: this.state.canVote.toString()
            }
          ]}
        />
      </Segment>
    );
  };

  renderBasicTopicDetails = () => {
    const topicExpired =
      timestampToDate(this.props.unixTimestamp) <= new Date().getTime();

    return (
      <Segment>
        <Card
          fluid
          raised
          header={"Text:"}
          meta={"Is this the Truth or a Lie?"}
          description={this.props.text}
          style={{ overflowWrap: "break-word" }}
        />

        {this.state.userArgument == "" ? (
          <Link route={`/topics/${this.props.address}/arguments/new`}>
            <a>
              <Button disabled={topicExpired} primary>
                {topicExpired
                  ? "Can't make an argument. Topic expired."
                  : "Make an Argument"}
              </Button>
            </a>
          </Link>
        ) : (
          <Button primary disabled>
            You've already made an argument.
          </Button>
        )}
      </Segment>
    );
  };

  render() {
    return (
      <React.Fragment>
        <Timer targetDate={timestampToDate(this.props.unixTimestamp)}></Timer>

        {/* <TopicGraphs/> */}
        {/* radius={({ datum }) => 1 + datum.y * 1} */}
        <Container textAlign="center">
          Ether Pool:{" "}
          {`${web3.utils.fromWei(this.props.etherPool.toString(), "ether")} Ether`}
        </Container>

        <Container textAlign="right"></Container>

        <h3>Topic Details</h3>
        <Grid columns={2} divided>
          <Grid.Row>
            <Grid.Column width={11}>
              {this.renderBasicTopicDetails()}
              {this.renderGraphs()}
              {this.state.userArgument != "" && this.renderUserArgument()}

              <InfiniteArgumentsList topicAddress={this.props.address} />
            </Grid.Column>

            <Grid.Column width={5}>
              {this.renderMetadata()}
              {/* <ContributeForm address={this.props.address} /> */}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </React.Fragment>
    );
  }
}

export default TopicDetails;
