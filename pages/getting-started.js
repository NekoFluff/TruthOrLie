import React, { Component, createRef } from "react";
import { Container, Menu, Grid, Segment } from "semantic-ui-react";
import { Link } from "../routes";

class GettingStarted extends Component {
  contextRef = createRef();

  state = {
    phase: 1
  };

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  renderTitle() {
    return (
      <Container textAlign="center">
        <Segment>
          <h1>Getting Started</h1>
        </Segment>
      </Container>
    );
  }

  renderMenu() {
    const { activeItem } = this.state;

    return (
      <Menu vertical>
        <Menu.Item>
          <Menu.Header>Getting Started</Menu.Header>

          <Menu.Menu>
            <Menu.Item
              href="#step1"
              name="Using Metamask"
              active={activeItem === "Using Metamask"}
              onClick={this.handleItemClick}
            />
            <Menu.Item
              href="#step2"
              name="Create a Reputation Smart Contract"
              active={activeItem === "Create a Reputation Smart Contract"}
              onClick={this.handleItemClick}
            />
            <Menu.Item
              href="#step3"
              name="Start posting Topics"
              active={activeItem === "Start posting Topics"}
              onClick={this.handleItemClick}
            />
            <Menu.Item
              href="#step4"
              name="Begin Fact Checking"
              active={activeItem === "Begin Fact Checking"}
              onClick={this.handleItemClick}
            />
            <Menu.Item
              href="#step5"
              name="Claiming Ether"
              active={activeItem === "Claiming Ether"}
              onClick={this.handleItemClick}
            />
          </Menu.Menu>
        </Menu.Item>
      </Menu>
    );
  }

  renderSteps() {
    return (
      <Segment>
        <h2>Questions?</h2>
        <p>
          Ask me on{" "}
          <a href="https://discord.gg/sCNpMAs" target="_blank">
            Discord
          </a>{" "}
          or{" "}
          <a href="https://twitter.com/TruthOrLie8" target="_blank">
            Twitter
          </a>
          . There is a FAQ message board in the discord channel as well, so make
          sure to take a look there first!
        </p>

        <h2 id="step1">Step 1: Download Metamask and create an account</h2>
        <p>
          Download Metamask{" "}
          <a href="https://metamask.io/" target="_blank">
            here
          </a>
          . TruthOrLie only supports Firefox and Google Chrome so make sure to
          use one of those explorers. Create your first wallet and switch to the
          Rinkeby Network.
        </p>
        <p>
          <b>
            WARNING: Make sure switch over to the Rinkeby Testnet in Metamask!
          </b>{" "}
          Since this is an Alpha test the smart contracts needed to run this
          application are only deployed on the Rinkeby network. All transactions
          will fail on any other network.
        </p>
        <p>
          <b>
            WARNING 2: Make sure to add this site as one of the allowed
            connections in Metamask.
          </b>{" "}
          In order to do so, go to <b>Settings</b> inside Metamask. Then go to{" "}
          <b>Connections</b>. Verify the site URL is correct. And finally press{" "}
          <b>Connect</b>. You can now use the site!
        </p>
        <p>
          You can get some ether from <a>faucet.rinkeby.io</a>. This requirees a
          Twitter account or Facebook account, but it's completely free.
          Instructions can be found on the page.
        </p>

        <h2 id="step2">Step 2: Create a Reputation Smart Contract</h2>
        <p>
          Once you have logged into your metamask account, make sure to refresh
          the page. The 'Oops an error has occured' at the top of the screen
          should disappear and a overlay should appear asking to create a
          Reputation Smart Contract. Press the button at the top left if this
          overlay does not appear.
        </p>
        <p>
          Simply press the OK button if you wish to participate. This will
          consume a small amount of ether, but you will be ready to start
          posting topics and fact checking. After the transaction goes through
          on the network, refresh the page and you should see a blue label at
          the top left with the text:{" "}
          <span style={{ color: "blue" }}>
            'Reputation Address: 0xYOUR_REPUTATION_SMART_CONTRACT_ADDRESS_HERE'
          </span>
          . If the label isn't blue, try refreshing the page after another 20 or
          so seconds.
        </p>

        <h2 id="step3">
          Step 3 (Optional): Start posting things to be fact checked
        </h2>
        <p>
          You can create topics by either pressing the <b>+</b> at the top right
          of your screen or by pressing the 'Create New Topic' button on the{" "}
          <Link route="/">
            <a>homepage</a>
          </Link>
          . Follow the prompts to create the new topic.
        </p>

        <h2 id="step4">Step 4: Begin fact checking</h2>
        <p>
          First you'll have to generate a random seed from the Provable Oracle
          by pressing the 'New Seed' button on the{" "}
          <Link route="/">
            <a>homepage</a>
          </Link>{" "}
          . This step is <b>mandatory</b>. This seed will be used to pick out 25
          non-unique random topics from the available topic pool. This is to
          prevent sybil attacks targeting particular topics of interest. There
          is a minimum ether cost of 0.005 ether of using this service which
          also prevents spam. The number of visible topics (currently 25) can be
          increased depending on the thoughts of the community during the Alpha
          testing period.
        </p>
        <p>
          On the homepage you should be able to see{" "}
          <b>25 non-unique randomly provided topics.</b> Click on any one of
          these to see more details including the ether in the topic pool, how
          many votes have been casted for both 'Truth' or 'Lie', and the
          reputation score for each side.
        </p>
        <p>
          If you don't like your topics, you can refresh the available topics by
          pressing the 'New Seed' button or by waiting until more topics are
          created. A new random seed from the Provable Oracle will be created
          for you which will determine which topics you are able to participate
          in and fact check.
        </p>

        <h2 id="step5">Step 5: Claiming ether</h2>
        <p>
          Go to{" "}
          <Link route="/mine/topics">
            <a>My Topics</a>
          </Link>{" "}
          at the top right of your screen. There you can view:
          <ul>
            <li>the topics you have posted</li>
            <li>the topics you have voted on</li>
            <li>the arguments you have created</li>
          </ul>{" "}
          If the voting period for any of the topics you have voted on have
          ended AND <b>you were on the side of the majority</b>, you will be
          able to claim your share of the reward pool by clicking on the Claim
          button.
        </p>
      </Segment>
    );
  }

  renderContent() {
    return (
      <Grid style={{ marginTop: 10 }} stackable columns={2}>
        <Grid.Column width={3}>{this.renderMenu()}</Grid.Column>
        <Grid.Column width={13}>{this.renderSteps()}</Grid.Column>
      </Grid>
    );
  }

  render() {
    return (
      <React.Fragment>
        {this.renderTitle()}
        {this.renderContent()}
      </React.Fragment>
    );
  }
}

export default GettingStarted;
