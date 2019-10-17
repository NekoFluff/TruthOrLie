import React, { Component } from "react";
import CommonPage from "../../components/CommonPage";
import NewTopicSteps from "../../components/NewTopicSteps";
import web3 from "../../ethereum/web3";
import { Form, Button, Message, Dropdown } from "semantic-ui-react";
import TopicSummary from "../../components/TopicSummary";

class NewTopic extends Component {
  state = {
    errorMessage: "",
    phase: 1,
    topicContent: "",
    minimumInvestment: "",
    hoursAvailable: "",
    
    // Billing
    accountsList: [],
    selectedAccount: "",
    initialTopicValue: "",

    // Billing errors
    accountSelectionError: "",

    // Topic-specific errors
    topicError: "",
    minimumInvestmentError: "",
    activeTimeError: "",
    initalTopicValueError: "",
    loading: false
  };

  async componentDidMount() {
    console.log("Component mounted:", this.state)
    await this.retrieveAccounts();
  }

  renderConfirmationForm() {
    return (
      <React.Fragment>
        <h2>Is this right?</h2>
        <TopicSummary
          returnToTopicScreen={() => {
            this.setState({ phase: 1 });
          }}
          returnToBillingScreen={() => {
            this.setState({ phase: 2 });
          }}
          {...this.state}
        />
      </React.Fragment>
    );
  }

  retrieveAccounts = async () => {
    const accounts = await web3.eth.getAccounts();

    let accountsList = accounts.map((acc) => {
      return {
        key: acc,
        text: acc,
        value: acc
      }
    })

    if (accounts.length == 0) {
      this.setState({ accountSelectionError: "There are no available accounts." })
    }

    this.setState({ accountsList })
  }

  renderBillingForm() {
    return (
      <React.Fragment>
        <h2>What account would you like to use?</h2>
        <Form onSubmit={this.onBillingNext} error={!!this.state.errorMessage}>
          <Form.Field>
            <Dropdown
              error={this.state.accountSelectionError != ""}
              placeholder="Select an Account"
              fluid
              selection
              options={this.state.accountsList}
              onChange={(event, {value}) => {this.setState({ accountSelectionError: "", selectedAccount: value })}}
            />
          </Form.Field>
          <Form.Input
            error={
              this.state.initalTopicValueError != "" && {
                content: this.state.initalTopicValueError,
                pointing: "below"
              }
            }
            fluid
            required
            label="Initial Topic Value (ether)"
            labelPosition="right"
            placeholder="How much do you want to invest in this topic? (Entice more users to participate)"
            type="number"
            value={this.state.initialTopicValue}
            onChange={event => {
              this.setState({ initialTopicValue: event.target.value });
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

  onBillingNext = async event => {
    event.preventDefault();
    try {
      if (this.state.selectedAccount == "") {
        this.setState({ accountSelectionError: "You must select an account before proceeding"});
        throw new Error("You must select an account before proceeding")
      }
      this.setState({ phase: 3, errorMessage: "" });
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
    this.setState({ loading: false });
  };

  renderNewTopicForm() {
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
            value={this.state.topicContent}
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
            value={this.state.minimumInvestment}
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
            value={this.state.hoursAvailable}
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

  renderContent() {
    if (this.state.phase == 1) return this.renderNewTopicForm();
    else if (this.state.phase == 2) return this.renderBillingForm();
    else return this.renderConfirmationForm();
  }   

  render() {
    return (
      <CommonPage>
        <NewTopicSteps active={this.state.phase}/>
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
