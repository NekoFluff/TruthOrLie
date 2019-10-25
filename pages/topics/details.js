import React, { Component } from "react";
import CommonPage from "./../../components/CommonPage";
import Topic from "../../ethereum/topic";
import { Card, Grid, Button, Segment } from "semantic-ui-react";
// import ContributeForm from "./../../components/ContributeForm";
import { Link } from "../../routes";
import InfiniteArgumentsList from "./../../components/InfiniteArgumentsList";

class TopicDetails extends Component {
  state = {};

  static async getInitialProps(props) {
    const topic = Topic(props.query.address);
    const details = await topic.methods.getDetails().call();
    const text = await topic.methods.content().call();

    // return {
    //   address: props.query.address,
    //   minimumContribution: details["minimumContribution"],
    //   balance: details["balance"],
    //   requestCount: details["requestCount"],
    //   contributorCount: details["contributorCount"],
    //   manager: details["manager"]
    // };
    console.log("Topic Details:", details);
    return {
      address: props.query.address,
      text: text,
      creator: details[0],
      isPublic: details[1],
      minimumInvestment: details[2],
      unixTimestamp: details[3],
      isCompleted: details[4]
    };
  }

  timeConverter(UNIX_timestamp) {
    const date = new Date(UNIX_timestamp * 1000);
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ];
    const year = date.getFullYear();
    const month = months[date.getMonth()];
    const day = date.getDate();
    const hour = date.getHours();
    const min = date.getMinutes();
    const sec = date.getSeconds();
    const time =
      day + " " + month + " " + year + " " + hour + ":" + min + ":" + sec;
    return time;
  }

  renderMetadata() {
    const {
      address,
      minimumInvestment,
      isCompleted,
      isPublic,
      creator,
      unixTimestamp
    } = this.props;

    const items = [
      {
        header: "Contract Address",
        meta: "The address for this Topic Contract",
        description: address,
        style: { overflowWrap: "break-word" }
      },
      {
        header: "Minimum Investment",
        meta: "Minimum amount a user needs to contribute when participating",
        description: `${minimumInvestment} wei`,
        style: { overflowWrap: "break-word" }
      },
      {
        header: "Completed?",
        meta:
          "If already completed, users may no longer participate in the discussion.",
        description: `${isCompleted}`,
        style: { overflowWrap: "break-word" }
      },
      {
        header: "Public",
        meta:
          "If the Topic has not been made public yet, it is not possible to participate just yet.",
        description: `${isPublic}`,
        style: { overflowWrap: "break-word" }
      },
      {
        header: "Creator",
        meta: "The one who created this Topic.",
        description: `${creator}`,
        style: { overflowWrap: "break-word" }
      },
      {
        header: "Unix Timestamp",
        meta: "At what time/date the discussion ends.",
        description: `${unixTimestamp}`,
        style: { overflowWrap: "break-word" }
      },
      {
        header: "End Date/Time",
        meta: "At what time/date the discussion ends.",
        description: `${this.timeConverter(unixTimestamp)}`,
        style: { overflowWrap: "break-word" }
      }
    ];
    return (
      <Card.Group>
        {items.map(item => {
          return <Card key={item.header} raised {...item} />;
        })}
      </Card.Group>
    );
  }

  render() {
    return (
      <CommonPage>
        <h3>Topic Details</h3>
        <Grid columns={2} divided>
          {/* <Grid.Row>
            <Grid.Column>
              <Link route={`/campaigns/${this.props.address}/requests`}>
                <a>
                  <Button primary>Make an Argument</Button>
                </a>
              </Link>
            </Grid.Column>
          </Grid.Row> */}

          <Grid.Row>
            <Grid.Column width={11}>
              <Segment>
                <Card
                  fluid
                  raised
                  header={"Topic"}
                  meta={"Is this the Truth or a Lie?"}
                  description={this.props.text}
                  style={{ overflowWrap: "break-word" }}
                />
                <Link route={`/topics/${this.props.address}/arguments/new`}>
                  <a>
                    <Button primary>Make an Argument</Button>
                  </a>
                </Link>
              </Segment>
              <InfiniteArgumentsList topicAddress={this.props.address} />
            </Grid.Column>

            <Grid.Column width={5}>
              {this.renderMetadata()}
              {/* <ContributeForm address={this.props.address} /> */}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </CommonPage>
    );
  }
}

export default TopicDetails;
