import React, { Component } from "react";
import { Card, Divider, Button, Container, Label } from "semantic-ui-react";
import { Link } from "../routes";
import YouTube from "react-youtube";
import { logEvent } from "../helpers/analytics.js";

class GettingStartedVideo extends Component {
  state = {};

  _onReady(event) {
    // access to player in all event handlers via event.target
    event.target.pauseVideo();
  }

  _onPlay(event) {
    logEvent("Getting Started Video", "Started introduction video", 1, "");
  }

  _onEnd(event) {
    logEvent("Getting Started Video", "Finished introduction video", 1, "");
  }

  //https://developers.google.com/youtube/player_parameters#list
  render() {
    const opts = {
      height: "390",
      width: "640",
      playerVars: {
        // https://developers.google.com/youtube/player_parameters
        autoplay: 0,
        list: "PL7kpyTRwZfvjrYMFB1QNEufAFUjOIp2km",
        listType: "playlist"
      }
    };

    return (
      <Container textAlign="center">
        <YouTube
          // videoId="_GOXqfv8uzI"
          opts={opts}
          onReady={this._onReady}
          onPlay={this._onPlay}
          onEnd={this._onEnd}
        />
      </Container>
    );
  }
}

export default GettingStartedVideo;
