import React, { Component } from "react";
import { Form, Button, Message } from "semantic-ui-react";

class TopicForm extends Component {
  state = {
    errorMessage: "",
    topicContent: "",
    minimumInvestment: "",
    hoursAvailable: "",

    // Errors
    topicError: "",
    minimumInvestmentError: "",
    activeTimeError: "",
    loading: ""
  };

  render() {
    const { topicContent, minimumInvestment, hoursAvailable } = this.state;

    return (
      <React.Fragment>
        {this.props.backButtonVisible && (
          <Button
            // style={{ marginBottom: "10px"} }
            primary
            // loading={this.state.loading}
            disabled={this.state.loading}
            onClick={this.props.onBackClick}
          >
            Back
          </Button>
        )}
        <h2>Let's talk about something!</h2>
        <Form onSubmit={this.onFormNext} error={!!this.state.errorMessage}>
          <Form.Input
            error={
              this.state.topicError != "" && {
                content: this.state.topicError,
                pointing: "below"
              }
            }
            required
            fluid
            label="Topic"
            placeholder="What should be discussed?"
            type="string"
            value={topicContent}
            onChange={event => {
              this.setState({ topicContent: event.target.value });
            }}
          />
          <Form.Input
            error={
              this.state.minimumInvestmentError != "" && {
                content: this.state.minimumInvestmentError,
                pointing: "below"
              }
            }
            fluid
            required
            label="Minimum Investment per Voter (wei)"
            placeholder="How much should each person be required to invest in order to partipate?"
            type="number"
            value={minimumInvestment}
            onChange={event => {
              this.setState({ minimumInvestment: event.target.value });
            }}
          />
          <Form.Input
            error={
              this.state.activeTimeError != "" && {
                content: this.state.activeTimeError,
                pointing: "below"
              }
            }
            fluid
            required
            label="Active Time (hours)"
            placeholder="How long should the voting period last?"
            type="number"
            value={hoursAvailable}
            onChange={event => {
              this.setState({ hoursAvailable: event.target.value });
            }}
          />

          <Message
            error
            header="Oops! Something went wrong"
            content={this.state.errorMessage}
          />
          <Button
            primary
            floated={"right"}
            loading={this.state.loading}
            disabled={this.state.loading}
          >
            Next
          </Button>
        </Form>
      </React.Fragment>
    );
  }
}

export default TopicForm;
