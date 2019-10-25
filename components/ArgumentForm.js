import React, { Component } from "react";
import {
  Form,
  Button,
  Message,
  Segment,
  Label,
  Divider,
  Container,
  TextArea,
  Checkbox
} from "semantic-ui-react";
import { connect } from "react-redux";
import { newArgument } from "./../redux/actions";
import Topic from "../ethereum/topic";

class ArgumentForm extends Component {
  state = {
    errorMessage: "",
    data: {
      argument: "",
      isTrue: ""
    },

    loading: false
  };

  static async getInitialProps(props) {
    try {
      const topic = Topic(props.query.address);
      const details = await topic.methods.getDetails().call();
      const text = await topic.methods.content().call();

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
    } catch (err) {
      console.log("[ArgumentForm.js] An error has occured:", err);
    }

    return {
      address: props.query.address
    };
  }

  componentDidMount() {
    this.setState({ data: this.props.data });
  }

  updateReduxState = () => {
    this.props.newArgument(this.state.data);
  };

  onFormNext = async event => {
    const { isTrue, argument } = this.state.data;

    event.preventDefault();
    //TODO: Double confirmation button OR Popup https://react.semantic-ui.com/modules/popup/
    this.setState({ loading: true });
    try {
      if (isTrue === "") {
        throw new Error("You must select either 'Truth' or 'Lie'");
      } else if (argument.length == 0) {
        throw new Error(
          "You must include some text in your argument. Otherwise, what is there to agree or disagree with?"
        );
      }

      this.updateReduxState();

      if (this.props.onFormNext != null) this.props.onFormNext();
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
    this.setState({ loading: false });
  };

  handleCheckboxChange = (e, { value }) => {
    this.setState({ data: { ...this.state.data, isTrue: value } });
  };

  render() {
    const { isTrue, argument } = this.state.data;

    return (
      <React.Fragment>
        {this.props.backButtonVisible && (
          <Button
            // style={{ marginBottom: "10px"} }
            primary
            disabled={this.state.loading}
            onClick={() => {
              this.updateReduxState();
              this.props.onBackClick();
            }}
          >
            Back
          </Button>
        )}

        <Segment raised>
          <span>The Topic</span>
          <Divider></Divider>
          <Container style={{ marginBottom: "20px" }} textAlign="center">
            <p>"{this.props.topicContent}"</p>
          </Container>
        </Segment>

        <Segment raised>
          <Form onSubmit={this.onFormNext} error={!!this.state.errorMessage}>
            <Form.Field>
              <b>Is this topic True?</b>
            </Form.Field>
            <Form.Field>
              <Checkbox
                radio
                label="Truth"
                name="checkboxRadioGroup"
                value="Truth"
                checked={isTrue === "Truth"}
                onChange={this.handleCheckboxChange}
              />
            </Form.Field>
            <Form.Field>
              <Checkbox
                radio
                label="Lie"
                name="checkboxRadioGroup"
                value="Lie"
                checked={isTrue === "Lie"}
                onChange={this.handleCheckboxChange}
              />
            </Form.Field>
            <TextArea
              rows={8}
              value={argument}
              placeholder="Your argument goes here. Let's try and stick to the facts."
              onChange={(event, { value }) => {
                this.setState({
                  data: { ...this.state.data, argument: value }
                });
              }}
            ></TextArea>

            <Message
              error
              header="Oops! Something went wrong"
              content={this.state.errorMessage}
            />
            <Button
              primary
              style={{ marginBottom: "20px", marginTop: "33px" }}
              floated={"right"}
              loading={this.state.loading}
              disabled={this.state.loading}
            >
              Next
            </Button>
          </Form>
        </Segment>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  console.log("New Argument state: ", state.newArgument);
  return { data: state.newArgument || {} };
};

export default connect(
  mapStateToProps,
  { newArgument }
)(ArgumentForm);
