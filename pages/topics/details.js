import React, { Component } from "react";
import CommonPage from "./../../components/CommonPage";
import Campaign from "../../ethereum/campaign";
import { Card, Grid, Button } from "semantic-ui-react";
import web3 from "../../ethereum/web3";
import ContributeForm from "./../../components/ContributeForm";
import { Link } from "../../routes";

class TopicDetails extends Component {
  state = {};

  static async getInitialProps(props) {
    const campaign = Campaign(props.query.address);
    const details = await campaign.methods.getDetails().call();

    console.log(details);

    return {
      address: props.query.address,
      minimumContribution: details["minimumContribution"],
      balance: details["balance"],
      requestCount: details["requestCount"],
      contributorCount: details["contributorCount"],
      manager: details["manager"]
    };
  }

  renderCards() {
    const {
      minimumContribution,
      balance,
      requestCount,
      contributorCount,
      manager
    } = this.props;

    const items = [
      {
        header: manager,
        meta: "Address of Manager",
        description:
          "The manager created this campaign and can create requests to withdraw money.",
        style: { overflowWrap: "break-word" }
      },
      {
        header: minimumContribution,
        meta: "Minimum Contribution (wei)",
        description:
          "You must contribute at last this mcuh wei to become a contributor.",
        style: { overflowWrap: "break-word" }
      },
      {
        header: requestCount,
        meta: "Number of Requests",
        description: "The number of active requests the manager has created.",
        style: { overflowWrap: "break-word" }
      },
      {
        header: contributorCount,
        meta: "Number of Contributors",
        description:
          "The manager created this campaign and can create requests to withdraw money.",
        style: { overflowWrap: "break-word" }
      },
      {
        header: web3.utils.fromWei(balance, "ether"),
        meta: "Balance in Ether",
        description: "How much money this campaign has left to spend",
        style: { overflowWrap: "break-word" }
      }
    ];

    return <Card.Group items={items} />;
  }

  render() {
    return (
      <CommonPage>
        <h3>Campaign Details</h3>
        <Grid columns={2} divided>
          <Grid.Row>
            <Grid.Column width={10}>{this.renderCards()}</Grid.Column>

            <Grid.Column width={6}>
              <ContributeForm address={this.props.address} />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Link route={`/campaigns/${this.props.address}/requests`}>
                <a>
                  <Button primary>View Requests</Button>
                </a>
              </Link>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </CommonPage>
    );
  }
}

export default TopicDetails;
