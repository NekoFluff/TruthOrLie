import React, { Component } from "react";
import CommonPage from "../../../components/CommonPage";
import VoteForm from "../../../components/VoteForm";
import { Grid, Segment, Divider, Container, Button } from "semantic-ui-react";
import { Link } from "../../../routes";
import { renderMultilineText } from './../../../helpers/multiline';

class NewArgument extends Component {
  state = {
    argumentisTrue: "Unable to retrieve argumentIsTrue from local storage.",
    argumentText: "Unable to retrieve argument text from local storage.",
    topicText: "0",
    topicMinimumInvestment: -1
  };

  static async getInitialProps(props) {
    // const topic = Topic(props.query.address);
    // const details = await topic.methods.getDetails().call();
    // const text = await topic.methods.content().call();
    // // TODO: Remove information fetch? I only seem to use the address and text....
    // console.log("[New Argument] Topic Details:", details);
    // return {
    //   address: props.query.address,
    //   text: text,
    //   creator: details[0],
    //   minimumInvestment: details[1],
    //   unixTimestamp: details[2],
    //   isCompleted: details[3]
    // };
    return {
      topicAddress: props.query.address
    };
  }

  componentDidMount() {
    this.setState({
      topicText: localStorage.getItem("topicText"),
      minimumInvestment: localStorage.getItem("topicMinimumInvestment"),
      argumentIsTrue: localStorage.getItem("argumentIsTrue"),
      argumentText: localStorage.getItem("argumentText"),
      argumentIndex: localStorage.getItem("argumentIndex")
    });
  }

  renderDetails = () => {
    const { topicText } = this.state;

    return (
      <React.Fragment>
        <Segment raised style={{ marginTop: "10px" }}>
          <span>The Topic</span>
          <Divider></Divider>
          <Container style={{ marginBottom: "20px" }} textAlign="center">
            <p>"{topicText}"</p>
          </Container>
        </Segment>

        <Segment raised>
          <span>The Argument</span>
          <Divider></Divider>
          <Container style={{ marginBottom: "20px" }} textAlign="left">
            <b>The topic is {this.state.argumentIsTrue}</b>
            {renderMultilineText(this.state.argumentText)}
          </Container>
        </Segment>
      </React.Fragment>
    );
  };

  render() {
    const { minimumInvestment, argumentIndex } = this.state;
    return (
      <Grid columns={2} divided>
        <Grid.Row>
          <Grid.Column width={10}>{this.renderDetails()}</Grid.Column>

          <Grid.Column width={6}>
            
            <VoteForm
              minimumInvestment={minimumInvestment}
              argumentIndex={argumentIndex}
              topicAddress={this.props.topicAddress}
            />
          </Grid.Column>
        </Grid.Row>
        {/* <Grid.Row>
            <Grid.Column>
              <Link route={`/deadlink`}>
                <a>
                  <Button primary>Temp Dead Link</Button>
                </a>
              </Link>
            </Grid.Column>
          </Grid.Row> */}
      </Grid>
    );
  }
}

export default NewArgument;
