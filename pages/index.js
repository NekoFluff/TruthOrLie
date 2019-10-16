import React, { Component } from "react";
import { Card, Button, Message, Icon } from "semantic-ui-react";
// import 'semantic-ui-css/semantic.min.css';
import CommonPage from "../components/CommonPage";
import { Link } from "../routes";
import factory from "../ethereum/factory";

export default class CampaignIndex extends Component {
  state = {};

  static async getInitialProps() {
    const topics = await factory.methods.getDeployedTopics().call();
    console.log("First Topic:", topics[0]);
    return { topics };
  }

  renderTopics() {
    const items = this.props.topics.map(address => {
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

    return <Card.Group items={items} />;
  }

  render() {
    return (
      <CommonPage>
        <h3>Open Topics</h3>
        <Message icon style={{ marginTop: "10px" }}>
          <Icon name="circle notched" loading />
          <Message.Content>
            <Message.Header>Just one second</Message.Header>
            We are fetching that content for you.
          </Message.Content>
        </Message>
        <Link route="/topics/new">
          <a>
            <Button
              fluid
              content="Create New Topic"
              icon="add"
              primary
              labelPosition="left"
            />
          </a>
        </Link>

        {this.renderTopics()}
      </CommonPage>
    );
  }
}
