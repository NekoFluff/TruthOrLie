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
import factory from "../ethereum/factory";
import { Link } from "../routes";
import Topic from "../ethereum/topic";

export default class InfiniteTopicsList extends Component {
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
    topics: [],
    totalTopicCount: 0,
    retrievingTopics: true,
    loadingTopicIndex: 0
  };
  contextRef = createRef();

  async componentDidMount() {
    await this.reloadTopicItems();
  }

  async reloadTopicItems() {
    this.setState({ retrievingTopics: true });
    const totalTopicCount = parseInt(await factory.methods
      .getNumberOfDeployedContracts()
      .call());
    this.setState({ totalTopicCount });
    await this.fetchTopics()
    this.setState({ retrievingTopics: false });
  }

  handleUpdate = async (e, { calculations }) => {
    this.setState({ calculations });
    await this.fetchTopics()
  };
  
  async fetchTopics() {
    const {loadingTopicIndex, totalTopicCount} = this.state;
    if (
      this.state.calculations.bottomVisible &&
      loadingTopicIndex < totalTopicCount
    ) {
      const maxCopies = Math.min(
        5,
        totalTopicCount - loadingTopicIndex
      );
      
      // Create a list of the objects to retrieve
      var appendList = [];
      this.setState({loadingTopicIndex: loadingTopicIndex + maxCopies})
      const topicAddresses = await factory.methods.getContracts(loadingTopicIndex, loadingTopicIndex + maxCopies).call();

      for (var i = 0; i < maxCopies; i++) {
        const address = topicAddresses[i];
        const topicContract = Topic(address)
        const text = await topicContract.methods.content().call()
        appendList.push({
          header: address,
          description: text,
          // meta: address
        });
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
        <h4>{`${this.state.loadingTopicIndex} ${this.state.loadingTopicIndex == 1 ? 'Topic' : 'Topics'} Loaded`}</h4>

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
          <Grid columns={2}>
            <Grid.Column>
              <Visibility onUpdate={this.handleUpdate}>
                <Segment>
                  {this.state.topics.map((props, index, images) => (
                    <React.Fragment key={index}>
                      <Card fluid {...props} extra={(<Link route={`/topics/${props.header}`}><a>View Topic</a></Link>)}/>
                      {index !== images.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </Segment>
              </Visibility>
            </Grid.Column>

            <Grid.Column>
              <Sticky context={this.contextRef}>
                <Table celled>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>Calculation</Table.HeaderCell>
                      <Table.HeaderCell>Value</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell>direction</Table.Cell>
                      <Table.Cell>{calculations.direction}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>pixelsPassed</Table.Cell>
                      <Table.Cell>
                        {calculations.pixelsPassed.toFixed()}px
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>percentagePassed</Table.Cell>
                      <Table.Cell>
                        {(calculations.percentagePassed * 100).toFixed()}%
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>fits</Table.Cell>
                      <Table.Cell>{calculations.fits.toString()}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>width</Table.Cell>
                      <Table.Cell>{calculations.width.toFixed()}px</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>height</Table.Cell>
                      <Table.Cell>{calculations.height.toFixed()}px</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>onScreen</Table.Cell>
                      <Table.Cell>
                        {calculations.onScreen.toString()}
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>offScreen</Table.Cell>
                      <Table.Cell>
                        {calculations.offScreen.toString()}
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>passing</Table.Cell>
                      <Table.Cell>{calculations.passing.toString()}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>topVisible</Table.Cell>
                      <Table.Cell>
                        {calculations.topVisible.toString()}
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>bottomVisible</Table.Cell>
                      <Table.Cell>
                        {calculations.bottomVisible.toString()}
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>topPassed</Table.Cell>
                      <Table.Cell>
                        {calculations.topPassed.toString()}
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>bottomPassed</Table.Cell>
                      <Table.Cell>
                        {calculations.bottomPassed.toString()}
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>
              </Sticky>
            </Grid.Column>
          </Grid>
        </Ref>
      </React.Fragment>
    );
  }
}
