import React, { Component } from "react";
import { Form, Button, Message, Container } from "semantic-ui-react";
import { connect } from "react-redux";
import { newTopic } from "./../redux/actions";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

class TopicForm extends Component {
  state = {
    errorMessage: "",
    data: {
      topicContent: "a",
      minimumInvestment: "1",
      endDate: new Date()
    },

    // Errors
    topicError: "",
    minimumInvestmentError: "",
    activeTimeError: "",
    loading: false
  };

  componentDidMount() {
    this.setState({ data: this.props.data });
  }

  updateReduxState = () => {
    this.props.newTopic(this.state.data);
  };

  sevenDaysFromNow = () => {
    var days = 7;
    var date = new Date();
    var res = date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    return res;
  };

  dateWithinAWeek = () => {
    return this.state.data.endDate <= this.sevenDaysFromNow();
  };

  onFormNext = async event => {
    // if (!this.dateWithinAWeek()) {
    //   console.log("Date isn't within a week.");
    //   return;
    // } else {
    //   console.log("Date is within a week.");
    // }

    event.preventDefault();
    //TODO: Double confirmation button OR Popup https://react.semantic-ui.com/modules/popup/
    this.setState({ loading: true });
    try {
      this.updateReduxState();

      if (this.props.onFormNext != null) this.props.onFormNext();
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
    this.setState({ loading: false });
  };

  handleDateChange = date => {
    this.setState({
      data: { ...this.state.data, endDate: date }
    });
  };

  render() {
    const { topicContent, minimumInvestment, endDate } = this.state.data;
    const now = new Date();
    const sevenDaysLater = this.sevenDaysFromNow();
    return (
      <React.Fragment>
        {this.props.backButtonVisible && (
          <Button
            // style={{ marginBottom: "10px"} }
            primary
            disabled={this.state.loading}
            onClick={() => {
              this.updateReduxState();
              this.props.onBackClick();
            }}
          >
            Back
          </Button>
        )}
        <h2>Let's talk about something!</h2>
        <Form onSubmit={this.onFormNext} error={!!this.state.errorMessage}>
          <Form.Input
            error={
              this.state.topicError != "" && {
                content: this.state.topicError,
                pointing: "below"
              }
            }
            required
            fluid
            label="Topic"
            placeholder="What should be discussed?"
            type="string"
            value={topicContent}
            onChange={event => {
              this.setState({
                data: { ...this.state.data, topicContent: event.target.value }
              });
            }}
          />
          <Form.Input
            error={
              this.state.minimumInvestmentError != "" && {
                content: this.state.minimumInvestmentError,
                pointing: "below"
              }
            }
            fluid
            required
            label="Minimum Investment per Voter (ether)"
            placeholder="How much should each person be required to invest in order to partipate?"
            type="number"
            value={minimumInvestment}
            onChange={event => {
              this.setState({
                data: {
                  ...this.state.data,
                  minimumInvestment: event.target.value
                }
              });
            }}
          />

          <Form.Field required>
            <label>When should this event end?</label>
            <DatePicker
              selected={endDate}
              onChange={this.handleDateChange}
              showTimeSelect
              timeIntervals="1"
              dateFormat="Pp"
              required
              minDate={now}
              maxDate={sevenDaysLater}
            />
          </Form.Field>
          <Message
            error
            header="Oops! Something went wrong"
            content={this.state.errorMessage}
          />
          <Button
            primary
            floated={"right"}
            loading={this.state.loading}
            disabled={this.state.loading}
          >
            Next
          </Button>
        </Form>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  console.log("New Topic state: ", state.newTopic);
  return { data: state.newTopic || {} };
};

export default connect(mapStateToProps, { newTopic })(TopicForm);
