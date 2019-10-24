import React, { Component } from "react";
import CommonPage from "../../components/CommonPage";
import NewTopicSteps from "../../components/NewTopicSteps";
import TopicForm from "../../components/TopicForm";
import TopicSummary from "../../components/TopicSummary";
import BillingForm from "../../components/BillingForm";

class NewTopic extends Component {
  state = {
    phase: 1,

    // Topic-specific errors
    minimumInvestmentError: "",
    activeTimeError: "",
    initalTopicValueError: ""
  };

  onFormNext = async event => {
    event.preventDefault();
    //TODO: Double confirmation button OR Popup https://react.semantic-ui.com/modules/popup/
    try {
      await this.retrieveAccounts();
      this.setState({ phase: 2, errorMessage: "" });
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
    this.setState({ loading: false });
  };

  onBillingNext() {
    this.setState({ phase: 3, errorMessage: "" });
  }

  onBackClick = () => {
    this.setState({ phase: Math.max(1, this.state.phase - 1) });
  };

  renderContent() {
    if (this.state.phase == 1)
      return (
        <TopicForm
          onBlackClick={this.onBackClick}
          backButtonVisible={this.state.phase > 1}
          onFormNext={this.onFormNext}
        />
      );
    else if (this.state.phase == 2)
      return (
        <BillingForm
          onBlackClick={this.onBackClick}
          backButtonVisible={this.state.phase > 1}
          onBillingNext={onBillingNext}
          {...this.state.billingInformation}
        />
      );
    else
      return (
        <TopicSummary
          onBlackClick={this.onBackClick}
          backButtonVisible={this.state.phase > 1}
          returnToTopicScreen={() => {
            this.setState({ phase: 1 });
          }}
          returnToBillingScreen={() => {
            this.setState({ phase: 2 });
          }}
          {...this.state.billingInformation}
          {...this.state.topicInformation}
        />
      );
  }

  render() {
    return (
      <CommonPage>
        <NewTopicSteps active={this.state.phase} />
        {this.renderContent()}
      </CommonPage>
    );
  }
}

export default NewTopic;
