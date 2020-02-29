import _ from "lodash";
import React, { Component, createRef } from "react";
import {
  Divider,
  Grid,
  Icon,
  Message,
  Card,
  Segment,
  Ref,
  Visibility,
  Button,
  Container,
  Label
} from "semantic-ui-react";
import factory from "../ethereum/topicFactory";
import { Link } from "../routes";
import Topic from "../ethereum/topic";
import {
  timestampToString,
  timestampToDate,
  approximateTimeTillDate
} from "./../helpers/date";
import web3 from "./../ethereum/web3";
import topicAssigner from "../ethereum/topicAssigner";
import { logEvent } from './../helpers/analytics';
export default class InfiniteTopicsList extends Component {
  state = {
    topicSeed: "",
    accountSelectionError: "",
    primaryAccount: "",
    topics: [],
    totalTopicCount: 0,
    retrievingTopics: false,
    topicsLoaded: 0
  };
  contextRef = createRef();

  canViewTopics() {
    const { topicSeed } = this.state;
    return (
      topicSeed != "0x0000000000000000000000000000000000000000" &&
      topicSeed != "" &&
      topicSeed != "0"
    );
  }

  async componentDidMount() {
    try {
      await this.reloadTopicItems();
    } catch (err) {
      console.log("[InfiniteTopicsList.js] An error has occured:", err);
    }
  }

  async getPrimaryAccount() {
    const accounts = await web3.eth.getAccounts();

    if (accounts == null || accounts.length == 0) {
      this.setState({
        accountSelectionError: "There are no available accounts."
      });
      console.log("No accounts available.");
    } else {
      this.setState({ primaryAccount: accounts[0] });
      console.log("Active account: " + accounts[0]);

      const topicSeed = await topicAssigner.methods
        .assignedVisibleTopics(accounts[0])
        .call();
      console.log("Topic Seed: " + topicSeed);
      this.setState({ topicSeed });
    }
  }

  handleUpdate = async (e, { calculations }) => {
    this.setState({ calculations });

    try {
      // await this.fetchTopics();
    } catch (err) {
      console.log("[InfiniteTopicsList.js] An error has occured:", err);
    }
  };

  handleRefresh = async () => {
    await this.getPrimaryAccount();
    if (this.state.primaryAccount == "") {
      console.log("No active account. Cannot refresh topics.");
    } else {
      await topicAssigner.methods.refreshRandomTopics().send({
        from: this.state.primaryAccount,
        value: web3.utils.toWei("0.005", "ether")
      });
      logEvent(category='Seed', action='Seed has been refreshed', label=this.state.primaryAccount);
      // Router.push("/");
    }
  };

  async reloadTopicItems() {
    try {
      await this.getPrimaryAccount();
      this.setState({ retrievingTopics: true });
      const totalTopicCount = parseInt(
        await factory.methods.getNumberOfDeployedContracts().call()
      );
      this.setState({ totalTopicCount });
      console.log("Fetching topics...");
      await this.fetchTopics();
      console.log("Fetched topics.");
      this.setState({ retrievingTopics: false });
    } catch (err) {
      console.log("[InfiniteTopicsList.js] An error has occured:", err);
    }
  }

  async fetchTopics() {
    // Check to make sure there are fetchable topics
    if (this.state.totalTopicCount == 0) {
      console.log("No topics available to fetch.");
      return;
    }

    const { primaryAccount, topicSeed } = this.state;
    var appendList = [];

    if (primaryAccount == "") {
      console.log("No active account. Cannot fetch topics.");
    } else if (!this.canViewTopics(topicSeed)) {
      console.log("Unable to view contacts");
    } else {
      console.log("Calling function with account: " + primaryAccount);
      const topicAddresses = await topicAssigner.methods
        .getRandomTopics(primaryAccount)
        .call();
      console.log("Topic Addresses:" + topicAddresses);

      for (var i = 0; i < topicAddresses.length; i++) {
        const address = topicAddresses[i];
        const topicContract = Topic(address);
        const text = await topicContract.methods.content().call();
        const details = await topicContract.methods.getDetails().call();
        const { days, hours, minutes } = approximateTimeTillDate(
          timestampToDate(details[2])
        );
        const timeTillString = `${days} Days ${hours} Hours ${minutes} Minutes`;

        var metaString = "Ended";
        if (days != 0 || hours != 0 || minutes != 0) {
          metaString = `Ends in: ${timeTillString} \n[${timestampToString(
            details[2]
          )}]`;
        }
        appendList.push({
          header: address,
          description: text,
          // meta: address
          meta: metaString,
          minimuminvestment: web3.utils.fromWei(details[1], "ether"),
          timestamp: details[2],
          topicpool: web3.utils.fromWei(details[6], "ether"),
          truthcount: details[7],
          liecount: details[8],
          truthreputation: details[9],
          liereputation: details[10]
        });
        console.log(
          "[InfiniteTopicList.js] End Date:",
          timestampToDate(details[2])
        );
      }

      // Set the new state
      this.setState({ topics: appendList });
    }
  }

  renderGrid = () => {
    return (
      <Ref innerRef={this.contextRef}>
        <Grid columns={1}>
          <Grid.Column>
            <Visibility onUpdate={this.handleUpdate}>
              <Segment>
                {this.state.topics.map((topic, index, images) => (
                  <React.Fragment key={index}>
                    <Card
                      color={
                        timestampToDate(topic.timestamp).getTime() >
                        new Date().getTime()
                          ? "green"
                          : "red"
                      }
                      fluid
                      {...topic}
                      extra={
                        <React.Fragment>
                          
                          <Link route={`/topics/${topic.header}`}>
                            <a><Button>View Topic</Button></a>
                          </Link>
                          
                          
                          <Container textAlign="right">
                            <Label.Group>
                              {/* <Label>
                                <Link route={`/topics/${topic.header}`}>
                                  <a>View Topic</a>
                                </Link>
                              </Label> */}

                              {topic.minimuminvestment && (
                                <Label>
                                  {`${topic.minimuminvestment} Minimum Ether to Vote`}
                                </Label>
                              )}
                            
                              {topic.topicpool && (
                                <Label>
                                  {`Topic Pool: ${topic.topicpool} Ether`}
                                </Label>
                              )}
                              </Label.Group>
                            {/* <Label.Group>
                              {topic.truthcount && (
                                <Label color="blue">
                                  {`# Truth Votes: ${topic.truthcount}`}
                                </Label>
                              )}
                            
                              {topic.liecount && (
                                <Label color="red">
                                  {`# Lie Votes: ${topic.liecount}`}
                                </Label>
                              )}
                              </Label.Group> */}
                            <Label.Group>
                              {topic.truthreputation && (
                                <Label color="blue">
                                  {`Total Truth Reputation: ${topic.truthreputation}`}
                                </Label>
                              )}
                              {topic.liereputation && (
                                <Label color="red">
                                  {`Total Lie Reputation: ${topic.liereputation}`}
                                </Label>
                              )}
                            </Label.Group>
                          </Container>
                        </React.Fragment>
                      }
                    />
                    {index !== images.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </Segment>
            </Visibility>
          </Grid.Column>
        </Grid>
      </Ref>
    );
  };

  render() {
    const { topicSeed, totalTopicCount, topics } = this.state;

    return (
      <React.Fragment>
        <h4>{`${topics.length} ${
          topics.length == 1 ? "Topic" : "Topics"
        } Loaded`}</h4>
        <Button
          color="orange"
          // circular
          // floated="right"
          style={{ marginBottom: "10px" }}
          onClick={this.handleRefresh}
        >
          New Seed
        </Button>

        <Message
          error
          style={{ marginTop: "10px" }}
          hidden={totalTopicCount > 0}
        >
          <Message.Content>
            <Message.Header>No topics available</Message.Header>
            Be the first to post a new intersting topic! Press the 'Create New
            Topic' button above.
          </Message.Content>
        </Message>

        <Message
          error
          style={{ marginTop: "10px" }}
          hidden={this.canViewTopics(topicSeed)}
        >
          <Message.Content>
            <Message.Header>Press 'New Seed'</Message.Header>
            Please press the 'New Seed' button. We need to generate a seed for
            you using the Provable Oracle, which will be used to pick the random
            topics that you will be able to fact check. IT WILL TAKE A MINUTE
            FOR THE ORACLE SO DON'T SPAM. Just refresh the page in a couple
            minutes after sending the transaction.
          </Message.Content>
        </Message>

        <Message
          icon
          style={{ marginTop: "10px" }}
          hidden={!this.state.retrievingTopics}
        >
          <Icon name="circle notched" loading />
          <Message.Content>
            <Message.Header>Just one second</Message.Header>
            We are fetching that content for you.
          </Message.Content>
        </Message>

        {this.renderGrid()}
      </React.Fragment>
    );
  }
}
