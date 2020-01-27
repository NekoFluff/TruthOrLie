import React, { Component } from "react";
import UserInfiniteTopicList from "../../components/UserInfiniteTopicList";
class MyTopics extends Component {
  state = {};
  render() {
    return (
      <React.Fragment>
        <h1>My Topics</h1>
        {/* TODO: REDUX TO STORE REPUTATION ADDRESS (CREATE_REPUTATION.JS) */}
        <UserInfiniteTopicList />
      </React.Fragment>
    );
  }
}

export default MyTopics;
