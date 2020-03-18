import _ from "lodash";
import React, { Component, createRef } from "react";
import { Divider, Ref, Visibility } from "semantic-ui-react";

import Topic from "../ethereum/topic";
import {
  timestampToString,
  timestampToDate,
  approximateTimeTillDate
} from "../helpers/date";
import Reputation from "../ethereum/reputation";
import { connect } from "react-redux";
import web3 from "./../ethereum/web3";
import FetchingContentMessage from "./FetchingContentMessage";
import TopicCard from "./TopicCard";
class UserInfiniteVotedTopicList extends Component {
  state = {
    topics: [],
    totalTopicCount: 0,
    retrievingTopics: true,
    loadingTopicIndex: 0,
    calculations: {
      bottomVisible: false
    }
  };
  contextRef = createRef();

  async componentDidMount() {
    try {
      await this.reloadTopicItems();
    } catch (err) {
      console.log("[UserInfiniteVotedTopicList.js] An error has occured:", err);
    }
  }

  async componentDidUpdate(prevProps, prevState) {
    // console.log("[UserInfiniteVotedTopicList.js] Component Did Update");
    try {
      if (prevProps.reputationAddress != this.props.reputationAddress) {
        await this.reloadTopicItems();
      } else {
        await this.fetchTopics();
      }
    } catch (err) {
      console.log(
        "[UserInfiniteVotedTopicList.js] An error has occured in componentDidUpdate:",
        err
      );
    }
  }

  async reloadTopicItems() {
    console.log("[UserInfiniteVotedTopicList.js] Reload Topic Items");
    if (this.props.reputationAddress == null) {
      return;
    }

    try {
      this.setState({ retrievingTopics: true });

      const reputationContract = Reputation(this.props.reputationAddress);

      const totalTopicCount = parseInt(
        await reputationContract.methods.getNumberOfTopics().call()
      );

      this.setState({ totalTopicCount });
      console.log("Fetching User Topics");
      await this.fetchTopics();
      console.log("Fetched User Topics");
      this.setState({ retrievingTopics: false });
    } catch (err) {
      console.log("[UserInfiniteVotedTopicList.js] An error has occured:", err);
    }
  }

  handleUpdate = async (e, { calculations }) => {
    this.setState({ calculations });

    try {
      await this.fetchTopics();
    } catch (err) {
      console.log("[UserInfiniteVotedTopicList.js] An error has occured:", err);
    }
  };

  async fetchTopics() {
    const { loadingTopicIndex, totalTopicCount } = this.state;
    if (
      (loadingTopicIndex == 0 && totalTopicCount > 0) ||
      (this.state.calculations.bottomVisible &&
        loadingTopicIndex < totalTopicCount) &&
        this.state.topics.length + 3 > loadingTopicIndex
    ) {
      const maxCopies = Math.min(5, totalTopicCount - loadingTopicIndex);

      // Create a list of the objects to retrieve
      this.setState({ loadingTopicIndex: loadingTopicIndex + maxCopies });
      const reputationContract = Reputation(this.props.reputationAddress);

      const topicAddresses = await reputationContract.methods
        .getTopics(
          totalTopicCount - loadingTopicIndex - maxCopies,
          totalTopicCount - loadingTopicIndex
        )
        .call();
      // Get a list of the accounts available
      const accounts = await web3.eth.getAccounts();

      // console.log("Available accounts:", accounts);
      // Retrieve user accounts and create a new campaign using the CampaignFactory
      if (accounts[0] == "") {
        throw new Error(
          "No account selected. Please go back to the Billing screen and choose an account."
        );
      }

      console.log("Metamask account: " + accounts[0]);

      console.log("Topic Addresses for User: " + topicAddresses);
      for (var i = maxCopies-1; i >= 0; i--) {
        const address = topicAddresses[i];
        const topicContract = Topic(address);
        const text = await topicContract.methods.content().call();
        const details = await topicContract.methods.getDetails().call({
          from: accounts[0]
        });
        // console.log(details);
        const { days, hours, minutes, seconds } = approximateTimeTillDate(
          timestampToDate(details[2])
        );
        const timeTillString = `${days} Days ${hours} Hours ${minutes} Minutes ${Math.round(
          seconds
        )} Seconds`;

        var metaString = "Ended";
        if (days != 0 || hours != 0 || minutes != 0 || seconds != 0) {
          metaString = `Ends in: ${timeTillString} \n[${timestampToString(
            details[2]
          )}]`;
        }

        // If the user can claim the reward, list how much ether they would earn
        var usableDetails = {
          header: address,
          description: text,
          // meta: address,
          creator: details[0],
          isCreator: (details[0] == accounts[0]).toString(),
          totalVoteCount: details[7] + details[8],
          meta: metaString,
          timestamp: details[2],
          canclaim: details[4].toString(),
          hasclaimed: details[5].toString(),
          result: "Ongoing",
          topicrewardpool: parseFloat(
            web3.utils.fromWei(details[6], "ether")
          ).toFixed(4)
        };

        // Get your argument
        if (details[7] + details[8] > 0) {
          const argumentIndex = await topicContract.methods
            .voted(accounts[0])
            .call();
          if (argumentIndex != 0) {
            const argument = await topicContract.methods
              .arguments(argumentIndex)
              .call();
            usableDetails["yourvote"] = argument["isTrue"] ? "Truth" : "Lie";

          // Get amount invested
          const investment = await topicContract.methods
          .monetaryInvestment(accounts[0])
          .call();
          usableDetails["investment"] = web3.utils.fromWei(investment, "ether");

          const repinvestment = await topicContract.methods
          .reputationInvestment(accounts[0])
          .call();
          usableDetails["repinvestment"] = repinvestment;

          // Get reputation gain
          const repgain = await topicContract.methods
          .calculateReputationGain(repinvestment, accounts[0])
          .call({
            from: accounts[0]
          });
          usableDetails["repgain"] = repgain;
          }
        }
              
        // Get monetary gain
        // if (investment == 0) {
        //   usableDetails["monetarygain"] = 0;
        // } else {
        //   const monetaryGain = await topicContract.methods
        //     .calculateMonetaryGain(investment, argument["isTrue"])
        //     .call({
        //       from: accounts[0]
        //     });
        //   usableDetails["monetarygain"] = parseFloat(web3.utils.fromWei(
        //     monetaryGain,
        //     "ether"
        //   )).toFixed(4);
        // }

        // Get the result
        if (
          timestampToDate(usableDetails.timestamp).getTime() <
          new Date().getTime()
        ) {
          const majority = await topicContract.methods.majority().call();
          usableDetails["majority"] = majority;
          if (majority == 1) {
            usableDetails["result"] = "TRUTH";
            usableDetails["topicresultcolor"] = "blue";
          } else if (majority == 2) {
            usableDetails["result"] = "LIE";
            usableDetails["topicresultcolor"] = "red";
          } else if (majority == 3) {
            usableDetails["result"] = "tie...";
            usableDetails["topicresultcolor"] = "yellow";
          }
        }

        console.log(
          "[UserInfiniteCreatedTopicList.js] End Date:",
          timestampToDate(details[2])
        );

        // Combine the lists
        const newTopicList = this.state.topics.concat(usableDetails);
        this.setState({ topics: newTopicList });
    }

    }
  }

  render() {
    // console.log(this.state.topics);
    return (
      <React.Fragment>
        <h4>{`${this.state.topics.length} ${
          this.state.topics.length == 1 ? "Topic" : "Topics"
        } Loaded [${this.state.totalTopicCount} total]`}</h4>

        <FetchingContentMessage
          retrievingTopics={this.state.retrievingTopics}
        />

        <Ref innerRef={this.contextRef}>
          <Visibility onUpdate={this.handleUpdate}>
            {/* For every topics... Create a card. */}
            {this.state.topics.map((topic, index, images) => (
              <React.Fragment key={index}>
                <TopicCard topic={topic} />
                {/* Add a divider... */}
                {index !== images.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </Visibility>
        </Ref>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  console.log(
    "[UserInfiniteVotedTopicList.js] mapStateToProps:",
    state.reputation
  );
  return { reputationAddress: state.reputation.reputationAddress };
};

export default connect(mapStateToProps)(UserInfiniteVotedTopicList);
