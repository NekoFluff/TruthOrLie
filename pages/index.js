import React, { Component } from "react";
import { Card, Button } from "semantic-ui-react";
// import 'semantic-ui-css/semantic.min.css';
import CommonPage from "../components/CommonPage";
import InfiniteTopicsList from "../components/InfiniteTopicsList";
import { Link } from "../routes";
import ReactGA from "react-ga";

export default class CampaignIndex extends Component {
  state = {};

  static async getInitialProps() {
    return { topics: [], items: [] };
  }

  renderTopics() {
    return (
      <React.Fragment>
        <InfiniteTopicsList />
        <Card.Group items={this.state.items} />
      </React.Fragment>
    );
  }

  render() {
    return (
      <React.Fragment>
        <h3>Open Topics</h3>

        <Link route="/topics/new">
          <a>
            <Button
              fluid
              style={{ marginBottom: "10px" }}
              content="Create New Topic"
              icon="add"
              primary
              labelPosition="left"
            />
          </a>
        </Link>

        {this.renderTopics()}
      </React.Fragment>
    );
  }
}
