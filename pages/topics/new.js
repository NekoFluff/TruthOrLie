import React, { Component } from "react";
import CommonPage from "../../components/CommonPage";
import NewTopicSteps from "../../components/NewTopicSteps";
import TopicForm from "../../components/TopicForm";
import TopicSummary from "../../components/TopicSummary";
import BillingForm from "../../components/BillingForm";

class NewTopic extends Component {
  state = {
    phase: 1
  };

  onFormNext = () => {
    this.setState({ phase: 2, errorMessage: ""});
  }

  onBillingNext = () => {
    this.setState({ phase: 3, errorMessage: "" });
  }

  onBackClick = () => {
    console.log("Back button clicked")
    this.setState({ phase: Math.max(1, this.state.phase - 1) });
  };

  renderContent() {
    if (this.state.phase == 1)
      return (
        <TopicForm
          onBackClick={this.onBackClick}
          backButtonVisible={this.state.phase > 1}
          onFormNext={this.onFormNext}
        />
      );
    else if (this.state.phase == 2)
      return (
        <BillingForm
          onBackClick={this.onBackClick}
          backButtonVisible={this.state.phase > 1}
          onBillingNext={this.onBillingNext}
        />
      );
    else
      return (
        <TopicSummary
          onBackClick={this.onBackClick}
          backButtonVisible={this.state.phase > 1}
          returnToTopicScreen={() => {
            this.setState({ phase: 1 });
          }}
          returnToBillingScreen={() => {
            this.setState({ phase: 2 });
          }}
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
