import React, { Component } from "react";
import { Modal, Button, Icon, Header } from "semantic-ui-react";

class MetaMaskModal extends Component {

  render() {
    return (
      <Modal open={this.props.open} basic size="small">
        <Header icon="archive" content="New User" />
        <Modal.Content>
          <p>
            Hi, you need to install Metamask at <a href="https://www.Metamask.io" target="_blank">Metamask.io</a>. Refresh the
            page when you have installed metamask and set up your account.
          </p>
          <br />
          <p>
            Check out the <a href="/getting-started">Getting Started</a> page
            for more information. (Press the checkmark to create an account
            later.)
          </p>
        </Modal.Content>
        <Modal.Actions>
          <Button
            onClick={this.props.onConfirm}
            color="green"
            inverted
          >
            <Icon name="checkmark" /> Ok
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default MetaMaskModal;
