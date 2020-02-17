import React, { Component } from "react";
import { Message, Icon } from 'semantic-ui-react';

class FetchingContentMessage extends Component {
  state = {};

  render() {
    return (
      <Message
        icon
        style={{ marginTop: "10px" }}
        hidden={!this.props.retrievingTopics}
      >
        <Icon name="circle notched" loading />
        <Message.Content>
          <Message.Header>Just one second</Message.Header>
          We are fetching that content for you.
        </Message.Content>
      </Message>
    );
  }
}

export default FetchingContentMessage;
