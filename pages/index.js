import React, { Component } from "react";
import { Card, Button, Message, Icon } from "semantic-ui-react";
// import 'semantic-ui-css/semantic.min.css';
import CommonPage from "../components/CommonPage";
import { Link } from "../routes";
import factory from "../ethereum/factory";

export default class CampaignIndex extends Component {
  state = {
    topics: [],
    items: [],
    retrievingTopics: true
  };

  static async getInitialProps() {
    return { topics: [], items: [] }
  }

  async componentDidMount() {
    this.setState({ retrievingTopics: true })
    const topics = await factory.methods.getDeployedTopics().call();
    console.log("First Topic:", topics[0]);
    const items = topics.map(address => {
      return {
        header: address,
        description: (
          <Link route={`/topics/${address}`}>
            <a>View Topic</a>
          </Link>
        ),
        fluid: true
      };
    });
    // return { topics, items };
    this.setState({ topics, items, retrievingTopics: false })
  }

  render() {
    return (
      <CommonPage>
        <h3>Open Topics</h3>
        
        <Link route="/topics/new" >
          <a>
            <Button
              fluid
              style={{marginBottom: "10px"}}
              content="Create New Topic"
              icon="add"
              primary
              labelPosition="left"
            />
          </a>
        </Link>

        <Message icon style={{ marginTop: "10px" }} hidden={!this.state.retrievingTopics}>
          <Icon name="circle notched" loading />
          <Message.Content>
            <Message.Header>Just one second</Message.Header>
            We are fetching that content for you.
          </Message.Content>
        </Message>

        <Card.Group items={this.state.items} />
        {/* {this.renderTopics()} */}
      </CommonPage>
    );
  }
}
