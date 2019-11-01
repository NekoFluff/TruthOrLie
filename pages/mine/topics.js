import React, { Component } from "react";
import CommonPage from "./../../components/CommonPage";
import UserInfiniteTopicList from "../../components/UserInfiniteTopicList";

class MyTopics extends Component {
  state = {};
  render() {
    return (
      <CommonPage>
        <h1>My Topics</h1>
        {/* TODO: REDUX TO STORE REPUTATION ADDRESS (CREATE_REPUTATION.JS) */}
        <UserInfiniteTopicList
          reputationAddress={"0x3f0985e6C3F8ffb296F525A1012abF3ad4Dd8A61"}
        />
      </CommonPage>
    );
  }
}

export default MyTopics;
