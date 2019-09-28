import React, { Component } from "react";
import { Card, Button } from "semantic-ui-react";
// import 'semantic-ui-css/semantic.min.css';
import CommonPage from "../components/CommonPage";
import { Link } from "../routes";

export default class CampaignIndex extends Component {
  state = {};

  static async getInitialProps() {
    // const campaigns = await factory.methods.getDeployedCampaigns().call();
    // console.log(campaigns[0]);
    // return { campaigns };
    return {};
  }

  // renderCampaigns() {
  //   const items = this.props.campaigns.map(address => {
  //     return {
  //       header: address,
  //       description: (
  //         <Link route={`/campaigns/${address}`}>
  //           <a>View Campaign</a>
  //         </Link>
  //       ),
  //       fluid: true
  //     };
  //   });

  //   return <Card.Group items={items} />;
  // }

  render() {
    return (
      <CommonPage>
        <h3>Open Topics</h3>
        <Link route="/topics/new">
          <a>
            <Button
              floated="right"
              content="Create New Topic"
              icon="add"
              primary
              labelPosition="left"
            />
          </a>
        </Link>
        {/* {this.renderCampaigns()} */}
      </CommonPage>
    );
  }
}
