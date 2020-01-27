import _ from "lodash";
import React, { Component, createRef } from "react";
import {
  Divider,
  Grid,
  Icon,
  Message,
  Card,
  Segment,
  Table,
  Button,
  Ref,
  Visibility
} from "semantic-ui-react";
import { Link } from "../routes";
import Topic from "../ethereum/topic";
import { timestampToString, timestampToDate } from "./../helpers/date";
import Reputation from "../ethereum/reputation";
import { connect } from "react-redux";

class UserInfiniteTopicList extends Component {
  state = {
    topics: [],
    totalTopicCount: 0,
    retrievingTopics: true,
    loadingTopicIndex: 0,
    calculations: {
      bottomVisible: false
    }
  };
  contextRef = createRef();

  async componentDidMount() {
    try {
      // await this.reloadTopicItems();
    } catch (err) {
      console.log("[UserInfiniteTopicList.js] An error has occured:", err);
    }
  }

  async componentDidUpdate(prevProps, prevState) {
    console.log("[UserInfiniteTopicList.js] Component Did Update");

    if (prevProps.reputationAddress != this.props.reputationAddress) {
      await this.reloadTopicItems();
    }
  }

  async reloadTopicItems() {
    console.log("[UserInfiniteTopicList.js] Reload Topic Items");
    if (this.props.reputationAddress == null) {
      return;
    }

    try {
      this.setState({ retrievingTopics: true });

      const reputationContract = Reputation(this.props.reputationAddress);

      const totalTopicCount = parseInt(
        await reputationContract.methods.getNumberOfTopics().call()
      );
      this.setState({ totalTopicCount });
      await this.fetchTopics();
      this.setState({ retrievingTopics: false });
    } catch (err) {
      console.log("[UserInfiniteTopicList.js] An error has occured:", err);
    }
  }

  handleUpdate = async (e, { calculations }) => {
    this.setState({ calculations });

    try {
      await this.fetchTopics();
    } catch (err) {
      console.log("[UserInfiniteTopicList.js] An error has occured:", err);
    }
  };

  async fetchTopics() {
    const { loadingTopicIndex, totalTopicCount } = this.state;
    if (
      this.state.calculations.bottomVisible &&
      loadingTopicIndex < totalTopicCount
    ) {
      const maxCopies = Math.min(5, totalTopicCount - loadingTopicIndex);

      // Create a list of the objects to retrieve
      var appendList = [];
      this.setState({ loadingTopicIndex: loadingTopicIndex + maxCopies });
      const reputationContract = Reputation(this.props.reputationAddress);

      const topicAddresses = await reputationContract.methods
        .getTopics(loadingTopicIndex, loadingTopicIndex + maxCopies)
        .call();

        for (var i = 0; i < maxCopies; i++) {
          const address = topicAddresses[i];
          const topicContract = Topic(address);
          const text = await topicContract.methods.content().call();
          const details = await topicContract.methods.getDetails().call();
          const {days, hours, minutes} = approximateTimeTillDate(timestampToDate(details[2]));
          const timeTillString = `${days} Days ${hours} Hours ${minutes} Minutes`
  
          var metaString = "Ended";
          if (days != 0 || hours != 0 || minutes != 0) {
            metaString = `Ends in: ${timeTillString} \n[${timestampToString(details[2])}]`
          }
          appendList.push({
            header: address,
            description: text,
            // meta: address
            meta: metaString,
            timestamp: details[2]
          });
          console.log(
            "[InfiniteTopicList.js] End Date:",
            timestampToDate(details[2])
          );
        }

      // Combine the lists
      const newTopicList = this.state.topics.concat(appendList);
      this.setState({ topics: newTopicList });
    }
  }

  render() {
    const { calculations } = this.state;

    return (
      <React.Fragment>
        <h4>{`${this.state.loadingTopicIndex} ${
          this.state.loadingTopicIndex == 1 ? "Topic" : "Topics"
        } Loaded`}</h4>

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
        <Ref innerRef={this.contextRef}>
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
                          <a>View Topic</a>
                        </Link>
                      </React.Fragment>
                    }
                  />
                  {index !== images.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </Segment>
          </Visibility>
        </Ref>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  console.log("[UserInfiniteTopicList.js] mapStateToProps:", state.reputation);
  return { reputationAddress: state.reputation.reputationAddress };
};

export default connect(mapStateToProps)(UserInfiniteTopicList);
