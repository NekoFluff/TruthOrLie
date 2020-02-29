import React, { Component } from "react";
import { Card, Container, Label, Button } from "semantic-ui-react";
import {
  timestampToDate,
} from "../helpers/date";
import { Link } from "../routes";
import web3 from "./../ethereum/web3";
import Topic from "../ethereum/topic";

class TopicCard extends Component {
  state = {};

  onClaim = async (topicAddress, creatorClaim) => {
    console.log("Claiming " + topicAddress);
    try {
      // Start the loading circle and reset the error message
      this.setState({ loading: true, errorMessage: "" });

      // Get a list of the accounts available
      const accounts = await web3.eth.getAccounts();

      // console.log("Available accounts:", accounts);
      console.log("Retrieved Account #0:", accounts[0]);

      // Retrieve user accounts and create a new campaign using the CampaignFactory
      if (accounts[0] == "") {
        throw new Error(
          "No account selected. Please go back to the Billing screen and choose an account."
        );
      }

      // Try to claim
      const topicContract = Topic(topicAddress);
      if (creatorClaim) {
        await topicContract.methods.creatorClaim().send({
          from: accounts[0],
          value: 0
        });
      } else {
        await topicContract.methods.claim().send({
          from: accounts[0],
          value: 0
        });
      }


      Router.replace("/mine/topics");
    } catch (err) {
      console.log("[TopicCard.js] Error: " + err)
      this.setState({ errorMessage: err.message });
    }
    this.setState({ loading: false });
  };

  render() {
    const { topic } = this.props;
    const topicEnded = timestampToDate(topic.timestamp).getTime() < new Date().getTime();
    const canCreatorClaim = topic.isCreator == "true" && topicEnded && topic.totalVoteCount == 0;
    console.log(topic.isCreator);
    console.log(topicEnded);
    console.log(topic.totalVoteCount);

    return (
      <Card
        color={
            !topicEnded
            ? "green"
            : "red"
        }
        fluid
        {...topic}
        extra={
          <React.Fragment>
            <Container textAlign="right">
              <Label.Group>
                <Label>
                  <Link route={`/topics/${topic.header}`}>
                    <a>View Topic</a>
                  </Link>
                </Label>
                <Label color={topic.yourvote == "Truth" ? "blue" : "red"}>
                  {`You Voted: ${topic.yourvote}`}
                </Label>
                {topic.investment && (
                  <Label color="red">
                    {`${topic.investment} Ether Invested`}
                  </Label>
                )}
                {topic.repinvestment && (
                  <Label color="red">
                    {`${topic.repinvestment} Reputation Invested`}
                  </Label>
                )}



              </Label.Group>
              <Label.Group>
                {topic.topicRewardPool && (
                  <Label color="blue">
                    {`Current Reward Pool: ~${topic.topicRewardPool} Ether`}
                  </Label>
                )}
                {topic.monetarygain && (
                  <Label color="blue">
                    {`Winner Reward: ~${topic.monetarygain} Ether`}
                  </Label>
                )}
                {topic.repgain && (
                  <Label color="blue">
                    {`Reputation Return: ~${topic.repgain} Ether`}
                  </Label>
                )}
              </Label.Group>
            </Container>

            <Container
              style={{ topMargin: "10px", marginBottom: "10px" }}
              textAlign="right"
            >
              <Label
                size="massive"
                color={topic.topicresultcolor}
              >{`VERDICT:   ${topic.result}`}</Label>
            </Container>
            {console.log("Topic:")}
            {console.log(topic)}
            {/* !((topic.yourvote == "Truth" && topic.result == "LIE") ||
              (topic.yourvote == "Lie" && topic.result == "TRUTH")) && */}
            { topicEnded && (topic.canclaim == "true" || topic.hasclaimed) && (
              <Button
                floated="right"
                color="blue"
                disabled={topic.hasclaimed == "true"}
                onClick={() => this.onClaim(topic.header, canCreatorClaim)}
              >
                {topic.hasclaimed == "false"
                  ? (topic.majority != 0 ? "Claim Ether/Reputation" : (canCreatorClaim ? "Reclaim as Creator" : "Find Majority and try to Claim Ether"))
                  : "Already Claimed Ether/Reputation"}
              </Button>
            )}
            
            {/* {((topic.yourvote == "Truth" && topic.result == "LIE") ||
              (topic.yourvote == "Lie" && topic.result == "TRUTH")) && (
              <Button
                floated="right"
                color="blue"
                disabled
                onClick={() => this.onClaim(topic.header)}
              >
                You weren't in the majority. No claiming for you.
              </Button>
            )} */}
          </React.Fragment>
        }
      />
    );
  }
}

export default TopicCard;
