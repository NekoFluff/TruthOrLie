import React, { Component } from "react";
import { Message } from "semantic-ui-react";

class Announcements extends Component {
  render() {
    return (
      <Message
        warning
        header="Alpha Test - Rinkeby Network Only"
        list={[
          "This application currently only works on the Rinkeby network.",
          "Please switch to the Rinkeby network in Metamask if you haven't already done so."
        ]}
      />
    );
  }
}

export default Announcements;
