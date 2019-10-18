import React, { Component } from "react";
import CommonPage from "../../components/CommonPage";
import NewTopicSteps from "../../components/NewTopicSteps";
import web3 from "../../ethereum/web3";
import { Form, Button, Message, Dropdown } from "semantic-ui-react";
import TopicSummary from "../../components/TopicSummary";
import BillingForm from "../../components/BillingForm";

class NewTopic extends Component {
  state = {
    errorMessage: "",
    phase: 1,

    // Topic
    topicInformation: {
      topicContent: "",
      minimumInvestment: "",
      hoursAvailable: "",
    },

    // Topic-specific errors
    topicError: "",
    minimumInvestmentError: "",
    activeTimeError: "",
    initalTopicValueError: ""
  };

  renderNewTopicForm() {
    const {topicContent, minimumInvestment, hoursAvailable} = this.state.topicInformation

    return (
      <React.Fragment>
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

  onFormNext = async event => {
    event.preventDefault();
    //TODO: Double confirmation button OR Popup https://react.semantic-ui.com/modules/popup/
    try {
      await this.retrieveAccounts();
      this.setState({ phase: 2, errorMessage: "" });
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
    this.setState({ loading: false });
  };

  onBillingNext() {
    this.setState({ phase: 3, errorMessage: "" });    
  };

  renderContent() {
    if (this.state.phase == 1) return this.renderNewTopicForm();
    else if (this.state.phase == 2) return <BillingForm onBillingNext={onBillingNext} {...this.state.billingInformation} />;
    else
      return (
        <TopicSummary
          returnToTopicScreen={() => {
            this.setState({ phase: 1 });
          }}
          returnToBillingScreen={() => {
            this.setState({ phase: 2 });
          }}
          {...this.state.billingInformation} 
          {...this.state.topicInformation}
        />
      );
  }

  render() {
    return (
      <CommonPage>
        <NewTopicSteps active={this.state.phase} />
        {this.state.phase > 1 && (
          <Button
            // style={{ marginBottom: "10px"} }
            primary
            // loading={this.state.loading}
            disabled={this.state.loading}
            onClick={() => {
              this.setState({ phase: Math.max(1, this.state.phase - 1) });
            }}
          >
            Back
          </Button>
        )}

        {this.renderContent()}
      </CommonPage>
    );
  }
}

export default NewTopic;
