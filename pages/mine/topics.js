import React, { Component } from "react";
import UserInfiniteTopicList from "../../components/UserInfiniteTopicList";
import UserInfiniteVotedTopicList from './../../components/UserInfiniteVotedTopicList';
import { Menu, Input, Segment } from "semantic-ui-react";
class MyTopics extends Component {
  state = { activeItem: "voted-topics" };

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  render() {
    const { activeItem } = this.state;

    return (
      <React.Fragment>
        <h1>My Topics</h1>
        {/* TODO: REDUX TO STORE REPUTATION ADDRESS (CREATE_REPUTATION.JS) */}
        <Menu attached="top" tabular>
          <Menu.Item
            name="voted-topics"
            active={activeItem === "voted-topics"}
            onClick={this.handleItemClick}
          />
           <Menu.Item
            name="created-topics"
            active={activeItem === "created-topics"}
            onClick={this.handleItemClick}
          />
          <Menu.Item
            name="arguments"
            active={activeItem === "arguments"}
            onClick={this.handleItemClick}
          />
          {/* <Menu.Menu position="right">
            <Menu.Item>
              <Input
                transparent
                icon={{ name: "search", link: true }}
                placeholder="Search bar not working atm."
              />
            </Menu.Item>
          </Menu.Menu> */}
        </Menu>

        <Segment attached="bottom">
          
          { this.state.activeItem == "voted-topics" ? <UserInfiniteVotedTopicList /> : "" }
          { this.state.activeItem == "created-topics" ? <UserInfiniteTopicList />  : "" }
          { this.state.activeItem == "arguments" ? <p>Arguments you have created will be visible here. This feature will be added in the near future.</p> : "" }
        </Segment>
      </React.Fragment>
    );
  }
}

export default MyTopics;
