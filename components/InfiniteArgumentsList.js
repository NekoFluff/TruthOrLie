import _ from "lodash";
import React, { Component, createRef } from "react";
import {
  Grid,
  Icon,
  Message,
  Ref,
  Visibility,
  Segment
} from "semantic-ui-react";
import Topic from "../ethereum/topic";
import ArgumentCardGroup from "./ArgumentCardGroup";

export default class InfiniteArgumentsList extends Component {
  state = {
    calculations: {
      direction: "none",
      height: 0,
      width: 0,
      topPassed: false,
      bottomPassed: false,
      pixelsPassed: 0,
      percentagePassed: 0,
      topVisible: false,
      bottomVisible: true,
      fits: false,
      passing: false,
      onScreen: false,
      offScreen: false
    },
    arguments: [],
    totalArgumentCount: 0,
    retrievingArguments: true,
    loadingArgumentIndex: 1
  };
  contextRef = createRef();

  async componentDidMount() {
    try {
      await this.reloadArgumentItems();
    } catch (err) {
      console.log("[InfiniteArgumentList.js] An error has occured:", err);
    }
  }

  async reloadArgumentItems() {
    this.setState({ retrievingArguments: true });
    const topicContract = Topic(this.props.topicAddress);
    const totalArgumentCount = await topicContract.methods
      .getArgumentCount()
      .call();
    this.setState({ totalArgumentCount });

    try {
      await this.fetchArguments();
    } catch (err) {
      console.log("[InfiniteArgumentsList.js] An error has occured:", err);
    }
    this.setState({ retrievingArguments: false });
  }

  handleUpdate = async (e, { calculations }) => {
    this.setState({ calculations });

    try {
      await this.fetchArguments();
    } catch (err) {
      console.log("[InfiniteArgumentsList.js] An error has occured:", err);
    }
  };

  async fetchArguments() {
    const {
      loadingArgumentIndex: loadingArgumentIndex,
      totalArgumentCount: totalArgumentCount
    } = this.state;
    if (
      this.state.calculations.bottomVisible &&
      loadingArgumentIndex < totalArgumentCount
    ) {
      const maxCopies = Math.min(5, totalArgumentCount - loadingArgumentIndex);

      // Create a list of the objects to retrieve
      var appendList = [];
      this.setState({ loadingArgumentIndex: loadingArgumentIndex + maxCopies });

      const topic = Topic(this.props.topicAddress);

      for (var i = 0; i < maxCopies; i++) {
        const argument = await topic.methods
          .arguments(loadingArgumentIndex + i)
          .call();
        appendList.push({
          header: argument["isTrue"] + `  [${argument["voteCount"]} votes]`,
          description: argument["content"],
          meta: "Posted by: " + argument["creator"],
          creator: argument["creator"],
          istrue: `${argument["isTrue"]}`,
          argumentindex: loadingArgumentIndex + i
        });
        console.log("[InfiniteArgumentList.js] ARGUMENT OBJECT:", argument);
      }

      // Combine the lists
      const newList = this.state.arguments.concat(appendList);
      this.setState({ arguments: newList });
    }
  }

  render() {
    return (
      <React.Fragment>
        <h4>{`${this.state.loadingArgumentIndex - 1} ${
          this.state.loadingArgumentIndex == 2 ? "Argument" : "Arguments"
        } Shown`}</h4>
        <Message
          icon
          style={{ marginTop: "10px" }}
          hidden={!this.state.retrievingArguments}
        >
          <Icon name="circle notched" loading />
          <Message.Content>
            <Message.Header>Just one second</Message.Header>
            We are fetching that content for you.
          </Message.Content>
        </Message>

        <Ref innerRef={this.contextRef}>
          <Grid columns={1}>
            <Grid.Column>
              <Visibility onUpdate={this.handleUpdate}>
                <Segment>
                  <ArgumentCardGroup
                    topicAddress={this.props.topicAddress}
                    arguments={this.state.arguments}
                  />
                </Segment>
              </Visibility>
            </Grid.Column>
          </Grid>
        </Ref>
      </React.Fragment>
    );
  }
}
