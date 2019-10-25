import React, { Component } from "react";
import CommonPage from "../../../components/CommonPage";
import ArgumentForm from "../../../components/ArgumentForm.js";
import NewArgumentSteps from "./../../../components/NewArgumentSteps";
import ArgumentBillingForm from "../../../components/ArgumentBillingForm";
import Topic from "../../../ethereum/topic";
import ArgumentSummary from "../../../components/ArgumentSummary";

class NewArgument extends Component {
  state = {
    phase: 1
  };

  static async getInitialProps(props) {
    const topic = Topic(props.query.address);
    const details = await topic.methods.getDetails().call();
    const text = await topic.methods.content().call();

    // return {
    //   address: props.query.address,
    //   minimumContribution: details["minimumContribution"],
    //   balance: details["balance"],
    //   requestCount: details["requestCount"],
    //   contributorCount: details["contributorCount"],
    //   manager: details["manager"]
    // };
    // TODO: Remove information fetch? I only seem to use the address and text....
    console.log("[New Argument] Topic Details:", details);
    return {
      address: props.query.address,
      text: text,
      creator: details[0],
      isPublic: details[1],
      minimumInvestment: details[2],
      unixTimestamp: details[3],
      isCompleted: details[4]
    };
  }

  onFormNext = () => {
    this.setState({ phase: 2, errorMessage: "" });
  };

  onBillingNext = () => {
    this.setState({ phase: 3, errorMessage: "" });
  };

  onBackClick = () => {
    console.log("Back button clicked");
    this.setState({ phase: Math.max(1, this.state.phase - 1) });
  };

  renderContent() {
    if (this.state.phase == 1)
      return (
        <ArgumentForm
          onBackClick={this.onBackClick}
          backButtonVisible={this.state.phase > 1}
          onFormNext={this.onFormNext}
          topicContent={this.props.text}
        />
      );
    else if (this.state.phase == 2)
      return (
        <ArgumentBillingForm
          onBackClick={this.onBackClick}
          backButtonVisible={this.state.phase > 1}
          onBillingNext={this.onBillingNext}
          minimumInvestment={this.props.minimumInvestment}
        />
      );
    else
      return (
        <ArgumentSummary
          topicContent={this.props.text}
          onBackClick={this.onBackClick}
          backButtonVisible={this.state.phase > 1}
          returnToTopicScreen={() => {
            this.setState({ phase: 1 });
          }}
          returnToBillingScreen={() => {
            this.setState({ phase: 2 });
          }}
          topicAddress={this.props.address}
        />
      );
  }

  render() {
    return (
      <CommonPage>
        <NewArgumentSteps active={this.state.phase} />
        {this.renderContent()}
      </CommonPage>
    );
  }
}

export default NewArgument;
