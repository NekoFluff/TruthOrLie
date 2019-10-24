import React, { Component } from "react";
import { Form, Button, Message, Dropdown } from "semantic-ui-react";
import web3 from './../ethereum/web3';
import { chooseBilling } from "./../redux/actions";
import { connect } from 'react-redux';
class BillingForm extends Component {
  state = {
    errorMessage: "",
    accountsList: [],
    
    // Information to be passed
    data: {
      selectedAccount: "",
      initialTopicValue: ""
    },
    
    // Errors
    initialTopicValueError: "",
    accountSelectionError: "",
    aaa: "asdasd",
    loading: false
  };

  async componentDidMount() {
    this.setState({ data: this.props.data})
    await this.retrieveAccounts();
  }

  retrieveAccounts = async () => {
    const accounts = await web3.eth.getAccounts();
    if (accounts == null || accounts.length == 0) {
      this.setState({
        accountSelectionError: "There are no available accounts."
      });
      return;
    }

    let accountsList = accounts.map(acc => {
      return {
        key: acc,
        text: acc,
        value: acc
      };
    });

    this.setState({ accountsList });
  };

  updateReduxState = () => {
    this.props.chooseBilling(this.state.data);
  }

  onBillingNext = (event) => {
    console.log(this.state)

    event.preventDefault();
    const { selectedAccount } = this.state.data;
    try {
      if (selectedAccount == "") {
        this.setState({
          accountSelectionError: "You must select an account before proceeding"
        });
        throw new Error("You must select an account before proceeding");
      }
      this.updateReduxState();
      this.props.onBillingNext();
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
    this.setState({ loading: false });
  }

  render() {
    const { initialTopicValue, selectedAccount } = this.state.data;
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
        <h2>What account would you like to use?</h2>
        <Form onSubmit={this.onBillingNext} error={!!this.state.errorMessage}>
          <Form.Field>
            <Dropdown
              error={this.state.accountSelectionError != ""}
              placeholder="Select an Account"
              fluid
              selection
              value={selectedAccount}
              options={this.state.accountsList}
              onChange={(event, { value }) => {
                this.setState({
                  accountSelectionError: "",
                  data: {
                    ...this.state.data,
                    selectedAccount: value
                  }
                });
              }}
            />
          </Form.Field>
          <Form.Input
            error={
              this.state.initialTopicValueError != "" && {
                content: this.state.initialTopicValueError,
                pointing: "below"
              }
            }
            fluid
            required
            label="Initial Topic Value (ether)"
            labelPosition="right"
            placeholder="How much do you want to invest in this topic? (Entice more users to participate)"
            type="number"
            value={initialTopicValue}
            onChange={event => {
              this.setState({ data: {...this.state.data, initialTopicValue: event.target.value }});
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
  console.log("Billing state:", state.billing)
  return { data: state.billing || {} }
}

export default connect(
  mapStateToProps,
  { chooseBilling }
)(BillingForm);
