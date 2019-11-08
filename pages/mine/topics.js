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
        <UserInfiniteTopicList />
      </CommonPage>
    );
  }
}

export default MyTopics;
