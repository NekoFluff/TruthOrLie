import React, { Component } from "react";
import CommonPage from "../../../components/CommonPage";
import VoteForm from "../../../components/VoteForm";
import { Grid, Segment, Divider, Container, Button } from "semantic-ui-react";
import { Link } from "../../../routes";

class NewArgument extends Component {
  state = {
    argumentisTrue: "Unable to retrieve argumentIsTrue from local storage.",
    argumentText: "Unable to retrieve argument text from local storage."
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

    return {};
  }

  componentDidMount() {
    this.setState({
      argumentIsTrue: localStorage.getItem("argumentIsTrue"),
      argumentText: localStorage.getItem("argumentText")
    });
  }

  renderDetails = () => {
    return (
      <React.Fragment>
        <Segment raised style={{ marginTop: "10px" }}>
          <span>The Topic</span>
          <Divider></Divider>
          <Container style={{ marginBottom: "20px" }} textAlign="center">
            <p>"{this.props.topicContent}"</p>
          </Container>
        </Segment>

        <Segment raised>
          <span>The Argument</span>
          <Divider></Divider>
          <Container style={{ marginBottom: "20px" }} textAlign="left">
            <b>The topic is {this.state.argumentIsTrue}</b>
            <p>"{this.state.argumentText}"</p>
          </Container>
        </Segment>
      </React.Fragment>
    );
  };

  render() {
    return (
      <Grid columns={2} divided>
        <Grid.Row>
          <Grid.Column width={10}>{this.renderDetails()}</Grid.Column>

          <Grid.Column width={6}>
            <VoteForm
              topicDetails={"Topic Details"}
              argumentDetails={"Argument Details"}
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
