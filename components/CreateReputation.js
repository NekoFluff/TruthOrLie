import React, { Component } from "react";
import reputationFactory from "../ethereum/reputationFactory";
import web3 from "./../ethereum/web3";
import { Button, Header, Icon, Modal, Message, Label } from "semantic-ui-react";
import { connect } from "react-redux";
import { updateReputationAddress } from "./../redux/actions";
import { Router, Link } from "../routes";

import {
  retrieveReputation,
  isValidReputationAddress
} from "./../helpers/reputation";
import { logEvent } from "./../helpers/analytics";
import MetaMaskModal from './MetaMaskModal';
class CreateReputation extends Component {
  state = {
    accounts: [],
    finishedLoading: false,
    modalOpen: false,
    metamaskModalOpen: true,
    creatingReputationContract: false,
    errors: [],
    currentReputation: "N/A"
  };

  async componentDidMount() {
    try {
      await this.loadReputation();
      console.log('CURRENT PAGE', window.location.pathname)
      if (typeof window !== "undefined" && window.location.pathname != '/getting-started') {
        this.setState({modalOpen: true})
      }
    } catch (err) {
      console.log("[CreateReputation.js] Error: ", err);
    }
  }

  loadReputation = async () => {
    try {
      const accounts = await web3.eth.getAccounts();
      if (accounts == null || accounts.length == 0) {
        this.setState({
          errors:
            ["Please log into your Metamask account using the Fox icon at the top-right and refresh the page.",
            "Still having issues? Add this site as an allowed connection:", 
            "---> While on the truthorlie.info website, click on the Fox Icon at the top-right",
            "---> Then the circle with abstract art at the top right",
            "---> Settings",
            "---> Connections",
            "---> Connect"]
        });
      }
      this.setState({ accounts });

      const { reputationAddress, rep } = await retrieveReputation(accounts[0]);
      this.setState({ currentReputation: rep });

      // Only update if the reputation address is different
      if (this.props.reputationAddress != reputationAddress) {
        this.props.updateReputationAddress({
          reputationAddress: reputationAddress
        });
      }
      console.log("Loaded Reputation...");
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
    // Create a new reputation contract for the user
    try {
      this.setState({ creatingReputationContract: true });
      logEvent(
        "Reputation",
        "Created new Reputation",
        0,
        this.state.accounts[0]
      );

      await reputationFactory.methods.createReputation().send({
        from: this.state.accounts[0]
      });

      await loadReputation();
    } catch (err) {
      console.log("[CreateReputation.js] Error: ", err);
    }

    this.setState({ creatingReputationContract: false, modalOpen: false });
    Router.pushRoute("/"); // refresh the page
  };

  isMetamaskInstalled = () => {
    return web3.currentProvider.isMetaMask === true
  }

  onMetaMaskModalConfirm = async () => {
    this.setState({ metamaskModalOpen: false });
  };

  renderForm = () => {
    if (!this.isMetamaskInstalled()) {
      return (
        <React.Fragment>
          <Button
          as="a"
          color="red"
          image
        >
        
          <Link  href="https://www.Metamask.io">
          <a style={{color: 'white'}}target="_blank"> Download Metamask HERE. (Refresh page after)</a>
          </Link>
          </Button>
          <MetaMaskModal open={this.state.metamaskModalOpen} onConfirm={this.onMetaMaskModalConfirm}/>
        </React.Fragment>

      )
    } else if (!isValidReputationAddress(this.props.reputationAddress)) {
      console.log("Ask user to create reputation.");
      return (
        <React.Fragment>
          <div>
            <Label
              as="a"
              color="red"
              onClick={() => {
                this.setState({ modalOpen: true });
              }}
              image
            >
              {/* <Label color="blue"> */}
              Reputation Address:
              <Label.Detail> Click here to create </Label.Detail>
            </Label>
          </div>
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
                (Don't worry, you can always do it later. Check out the{" "}
                <a href="/getting-started">Getting Started</a> page. It will
                take a small amount of ether to create the Reputation Contract
                and get started.)
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
        </React.Fragment>
      );
    } else {
      console.log("Is valid address.");
    }
  };

  render() {
    // console.log("Render [CreateReputation.js state]: ", this.state);
    if (!this.state.finishedLoading) { // Wait to retrieve data
      return <React.Fragment></React.Fragment>;
    } else {
      if (this.state.errors.length > 0) {
        return (
          <Message
            error
            header="Oops! An error has occured"
            list={this.state.errors}
          />
        );
      } else if (isValidReputationAddress(this.props.reputationAddress)) {
        console.log("Valid return address..." + this.props.reputationAddress);
        return (
          <Label.Group>
            <Label as="a" href="/mine/topics" color="blue" image>
              {/* <Label color="blue"> */}
              Reputation:
              <Label.Detail>{this.state.currentReputation}</Label.Detail>
            </Label>
            <Label as="a" href="/mine/topics" color="blue" image>
              {/* <Label color="blue"> */}
              Reputation Address:
              <Label.Detail>{this.props.reputationAddress}</Label.Detail>
            </Label>
          </Label.Group>
        );
      } else {
        return this.renderForm();
      }
    }
  }
}

const mapStateToProps = state => {
  // console.log("New Reputation state: ", state.reputation);
  return { reputationAddress: state.reputation.reputationAddress };
};

export default connect(mapStateToProps, { updateReputationAddress })(
  CreateReputation
);
