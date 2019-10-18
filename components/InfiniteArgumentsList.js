import _ from "lodash";
import React, { Component, createRef } from "react";
import {
  Divider,
  Grid,
  Image,
  Icon,
  Message,
  Card,
  Segment,
  Sticky,
  Table,
  Ref,
  Visibility
} from "semantic-ui-react";
import { Link } from "../routes";
import Topic from "../ethereum/topic";

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
    arguements: [],
    totalArgumentCount: 0,
    retrievingArguments: true,
    loadingArgumentIndex: 0
  };
  contextRef = createRef();

  async componentDidMount() {
    await this.reloadArgumentItems();
  }

  async reloadArgumentItems() {
    this.setState({ retrievingArguments: true });
    const topicContract = Topic(this.props.topicAddress)
    const totalArgumentCount = parseInt(topicContract.methods.getArgumentCount().call());
    this.setState({ totalArgumentCount });
    await this.fetchArguments()
    this.setState({ retrievingArguments: false });
  }

  handleUpdate = async (e, { calculations }) => {
    this.setState({ calculations });
    await this.fetchArguments()
  };
  
  async fetchArguments() {
    const {loadingArgumentIndex: loadingArgumentIndex, totalArgumentCount: totalArgumentCount} = this.state;
    if (
      this.state.calculations.bottomVisible &&
      loadingArgumentIndex < totalArgumentCount
    ) {
      const maxCopies = Math.min(
        5,
        totalArgumentCount - loadingArgumentIndex
      );
      
      // Create a list of the objects to retrieve
      var appendList = [];
      this.setState({loadingArgumentIndex: loadingArgumentIndex + maxCopies})

      for (var i = 0; i < maxCopies; i++) {
        const address = topicAddresses[i];
        const text = await this.props.topicContract.methods.argument(loadingArgumentIndex + i).call()
        appendList.push({
          header: "HELLO. THIS IS A SAMPLE ARGUMENT.",
          // description: text,
          // meta: address
        });
        console.log('ARGUMENT OBJECT:', text);
      }

      // Combine the lists
      const newList = this.state.arguements.concat(appendList);
      this.setState({ arguments: newList });
    }
  }

  render() {
    return (
      <React.Fragment>
        <h4>{`${this.state.loadingArgumentIndex} Arguments`}</h4>
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
                  {this.state.arguements.map((props, index, images) => (
                    <React.Fragment key={index}>
                      <Card fluid {...props} extra={(<Link route={`/topics/${props.header}`}><a>View Topic</a></Link>)}/>
                      {index !== images.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </Segment>
              </Visibility>
            </Grid.Column>
          </Grid>
        </Ref>
      </React.Fragment>
    );
  }
}
