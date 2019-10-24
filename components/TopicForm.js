import React, { Component } from "react";
import { Form, Button, Message } from "semantic-ui-react";
import { connect } from 'react-redux'
import { newTopic } from './../redux/actions';

class TopicForm extends Component {
  state = {
    errorMessage: "",
    data: {
      topicContent: "a",
      minimumInvestment: "1",
      hoursAvailable: ""
    },

    // Errors
    topicError: "",
    minimumInvestmentError: "",
    activeTimeError: "",
    loading: false
  };

  componentDidMount() {
    this.setState({ data: this.props.data})
  }

  updateReduxState = () => {
    this.props.newTopic(this.state.data)
  }

  onFormNext = async event => {
    event.preventDefault();
    //TODO: Double confirmation button OR Popup https://react.semantic-ui.com/modules/popup/
    this.setState({ loading: true })
    try {
      this.updateReduxState()

      if (this.props.onFormNext != null) 
        this.props.onFormNext()
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
    this.setState({ loading: false });
  };

  render() {
    const { topicContent, minimumInvestment, hoursAvailable } = this.state.data;

    return (
      <React.Fragment>
        {this.props.backButtonVisible && (
          <Button
            // style={{ marginBottom: "10px"} }
            primary
            disabled={this.state.loading}
            onClick={() => {this.updateReduxState(); this.props.onBackClick()}}
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
              this.setState( { data: {...this.state.data, topicContent: event.target.value} });
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
              this.setState({ data: {...this.state.data, minimumInvestment: event.target.value} });
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
              this.setState({ data: {...this.state.data, hoursAvailable: event.target.value} });
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

const mapStateToProps = state => {
  console.log("New Topic state: ", state.newTopic)
  return { data: state.newTopic || {} }
}

export default connect(
  mapStateToProps,
  { newTopic }
)(TopicForm);
