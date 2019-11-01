import React, { Component } from "react";
import reputationFactory from "../ethereum/reputationFactory";
import web3 from "./../ethereum/web3";
import { Button, Header, Icon, Modal, Message, Label } from "semantic-ui-react";

class CreateReputation extends Component {
  state = {
    accounts: [],
    reputationAddress: "",
    finishedLoading: false,
    modalOpen: true,
    creatingReputationContract: false,
    error: ""
  };

  async componentDidMount() {
    try {
      await this.loadReputation();
    } catch (err) {
      console.log("[CreateReputation.js] Error: ", err);
    }
  }

  loadReputation = async () => {
    try {
      const accounts = await web3.eth.getAccounts();
      if (accounts == null || accounts.length == 0) {
        this.setState({
          error:
            "There are no available accounts. Please log into your metamask account using the browser plugin and refresh the page."
        });
      }
      this.setState({ accounts });

      const reputationAddress = await reputationFactory.methods
        .deployedReputations(accounts[0])
        .call();
      this.setState({ reputationAddress });
    } catch (err) {
      console.log("[CreateReputation.js] Error: ", err);
    }

    console.log(
      "Finished querying for accounts and reputation contract address"
    );
    this.setState({ finishedLoading: true });
  };

  onCancel = () => {
    this.setState({ modalOpen: false });
  };

  onConfirm = async () => {
    this.setState({ creatingReputationContract: true });

    // Create a new reputation contract for the user
    try {
      await reputationFactory.methods.createReputation().send({
        from: this.state.accounts[0]
      });
      await loadReputation();
    } catch (err) {
      console.log("[CreateReputation.js] Error: ", err);
    }

    this.setState({ creatingReputationContract: false, modalOpen: false });
  };

  renderForm = () => {
    if (
      this.state.reputationAddress ==
      "0x0000000000000000000000000000000000000000"
    ) {
      return (
        <Modal open={this.state.modalOpen} basic size="small">
          <Header icon="archive" content="New User" />
          <Modal.Content>
            <p>
              Hi, it seems like you are using a new ethereum address. You will
              need a new <b>Reputation Contract</b> in order to use this
              application. Would you like to create one now?
            </p>
            <br />
            <p>
              (It will take a small amount of ether to create the Reputation
              Contract and get started.)
            </p>
          </Modal.Content>
          <Modal.Actions>
            <Button
              disabled={this.state.creatingReputationContract}
              onClick={this.onCancel}
              basic
              color="red"
              inverted
            >
              <Icon name="remove" /> No
            </Button>
            <Button
              disabled={this.state.creatingReputationContract}
              loading={this.state.creatingReputationContract}
              onClick={this.onConfirm}
              color="green"
              inverted
            >
              <Icon name="checkmark" /> Yes
            </Button>
          </Modal.Actions>
        </Modal>
      );
    }
  };

  render() {
    console.log("[CreateReputation.js state]: ", this.state);
    if (!this.state.finishedLoading) {
      return <React.Fragment></React.Fragment>;
    } else {
      if (this.state.error != "") {
        return (
          <Message
            error
            header="Oops! An error has occured"
            list={[this.state.error]}
          />
        );
      } else if (
        this.state.reputationAddress !=
        "0x0000000000000000000000000000000000000000"
      ) {
        return (
          <div>
            <Label as="a" color="blue" image>
              {/* <Label color="blue"> */}
              Reputation Address:
              <Label.Detail>{this.state.reputationAddress}</Label.Detail>
            </Label>
          </div>
        );
      } else {
        return this.renderForm();
      }
    }
  }
}

export default CreateReputation;
