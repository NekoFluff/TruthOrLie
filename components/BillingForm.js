import React, { Component } from 'react';

class BillingForm extends Component {
  state = { 
    
    errorMessage: "",
    accountsList: [],
    accountSelectionError: "",

    // Information to be passed
    selectedAccount: "",
    initialTopicValue: "",

    loading: false
   }

   async componentDidMount() {
    console.log("Billing Form mounted:", this.state);
    await this.retrieveAccounts();
  }

   retrieveAccounts = async () => {
    const accounts = await web3.eth.getAccounts();

    let accountsList = accounts.map(acc => {
      return {
        key: acc,
        text: acc,
        value: acc
      };
    });

    if (accounts.length == 0) {
      this.setState({
        accountSelectionError: "There are no available accounts."
      });
    }

    this.setState({ accountsList });
  };

  onBillingNext() {
    event.preventDefault();
    const {selectedAccount} = this.state.selectedAccount
    try {
      if (selectedAccount == "") {
        this.setState({ accountSelectionError: "You must select an account before proceeding"});
        throw new Error("You must select an account before proceeding")
      }
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
    this.setState({ loading: false });
    this.props.onBillingNext()
  }

  render() { 
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

  
}
 
export default BillingForm;