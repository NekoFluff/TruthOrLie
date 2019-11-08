import React, { Component } from "react";
import { Container } from "semantic-ui-react";

class Timer extends Component {
  state = {
    secondsRemaining: -1,
    seconds: 0,
    minutes: 0,
    hours: 0,
    days: 0,
    timeHasPassed: false
  };

  componentDidMount() {
    this.initializeState();
    this.startCountDown();
  }

  componentWillUnmount() {
    clearInterval(this.intervalHandle);
  }

  initializeState = () => {
    this.tick();
  };

  tick = () => {
    // Get today's date and time
    const now = new Date().getTime();

    // Find the distance between now and the count down date
    const distance = this.props.targetDate - now;
    const secondsRemaining = Math.floor(distance / 1000);

    // Time calculations for days, hours, minutes and seconds
    const days = Math.floor(secondsRemaining / (60 * 60 * 24));
    const hours = Math.floor((secondsRemaining % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((secondsRemaining % (60 * 60)) / 60);
    const seconds = Math.floor(secondsRemaining % 60);

    this.setState({
      secondsRemaining,
      seconds,
      minutes,
      hours,
      days
    });

    if (secondsRemaining <= 0) {
      clearInterval(this.intervalHandle);
      this.setState({ timeHasPassed: true });
    }
  };

  startCountDown() {
    if (!this.state.timeHasPassed) {
      this.intervalHandle = setInterval(this.tick, 1000);
    }
  }

  render() {
    return (
      <Container style={{ marginTop: "10px" }} textAlign="center">
        {this.state.timeHasPassed ? (
          <h1>Topic has expired.</h1>
        ) : (
          <h1>
            {this.doubleDigit(this.state.days) +
              "D " +
              this.doubleDigit(this.state.hours) +
              "H " +
              this.doubleDigit(this.state.minutes) +
              "M " +
              this.doubleDigit(this.state.seconds) +
              "S "}
            Remaining
          </h1>
        )}
      </Container>
    );
  }

  // Makes sure it's a double digit number
  doubleDigit(number) {
    if (number < 10) {
      return "0" + number;
    } else {
      return String(number);
    }
  }
}

export default Timer;
