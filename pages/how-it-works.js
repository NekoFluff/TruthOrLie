import React, { Component, createRef } from "react";
import { Container, Menu, Grid, Segment, Button } from "semantic-ui-react";
import { Link } from "../routes";

class HowItWorks extends Component {
  contextRef = createRef();

  state = {
    phase: 1
  };

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  renderTitle() {
    return (
      <Container textAlign="center">
        <Segment>
          <h1>How It Works</h1>
        </Segment>
      </Container>
    );
  }

  renderMenu() {
    const { activeItem } = this.state;

    return (
      <Menu vertical>
        <Menu.Item>
          <Menu.Header>How It Works</Menu.Header>

          <Menu.Menu>
            <Menu.Item
              href="#goal"
              name="The Goal"
              active={activeItem === "The Goal"}
              onClick={this.handleItemClick}
            />
            <Menu.Item
              href="#rewards"
              name="An Important Intro to Rewards"
              active={activeItem === "An Important Intro to Rewards"}
              onClick={this.handleItemClick}
            />
            <Menu.Item
              href="#step1"
              name="Posting Topics"
              active={activeItem === "Posting Topics"}
              onClick={this.handleItemClick}
            />
            <Menu.Item
              href="#step2"
              name="People Fact Check"
              active={activeItem === "People Fact Check"}
              onClick={this.handleItemClick}
            />
            <Menu.Item
              href="#step3"
              name="Claim Rewards"
              active={activeItem === "Claim Rewards"}
              onClick={this.handleItemClick}
            />
            <Menu.Item
              href="#example"
              name="Example"
              active={activeItem === "Example"}
              onClick={this.handleItemClick}
            />
            <Menu.Item
              href="#participate"
              name="Come Participate"
              active={activeItem === "Come Participate"}
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
        <h2 id="goal">The Goal</h2>
        <p>
          <b>
            The goal is to create an ecosystem that promotes and values the
            truth.
          </b>
        </p>

        <h2 id="rewards">An Important Intro to Rewards</h2>
        <p>
          It is important to note that fact checker rewards are from the{" "}
          <b>topic reward pool</b> (each topic being fact checked has its own
          reward pool). The topic reward pool consists of:
          <ol>
            <li>
              ether from the topic poster (initial ether to entice users to fact
              check their topic)
            </li>{" "}
            <li>
              and ether from the fact checkers themselves (the ether spent by
              each user when voting).
            </li>
          </ol>
          Rewards are redistributed based on the amount of ether invested when
          voting.
        </p>

        <h2 id="step1">Step 1: Posters post intriguing topics</h2>
        <p>
          Posters will first post a topic. They will provide information such
          as:
          <ul>
            <li>
              A short sentence on the topic (with possibly a link to the
              source).
            </li>
            <li>
              Minimum ether investment to participate in the fact checking
              process. (A higher minimum ether incentivizes more well though
              answers at the cost of fewer participants.)
            </li>
            <li>
              Completion Date/Time: When the topic period ends. Maximum 7 days
              from the current date.
            </li>
            <li>
              Initial Topic Reward Pool: Ether put in by the poster to
              incentivize users to participate in the fact checking process.
              Effort requires payment.
            </li>
          </ul>
        </p>

        <h2 id="step2">Step 2: Every day people fact check</h2>
        <p>
          During the period the fact check is active, every day people such as
          yourself will create hopefully convincing arguments with appropriate
          links either for the 'Truth' side or 'Lie' side. You can only create
          one argument per topic and can only vote once per topic. Each vote is
          attached to single argument.
        </p>
        <p>
          When voting, the minimum amount of ether (as set by the poster) must
          be spent by the user and placed into the topic's reward pool. This is
          put into the topic's reward pool.
        </p>
        <p>
          <b>Important Note:</b> If no one participated in the fact check, the
          contents of the reward pool can be reclaimed by the Poster who created
          the topic. Look at 'Claiming Ether in the 'Getting-Started' for more
          details.
        </p>

        <h2 id="step3">Step 3: Claim Rewards</h2>
        <p>
          After the voting period ends for a topic, the fact checkers who voted
          will be able to view the final results. If they voted on the side of
          the final majority, they will be able to claim their reward in
          proportion to the amount of ether they sent to the topic smart
          contract when voting.
        </p>

        <h2 id="example">Example:</h2>
        <p>
          <ol>
            <li>
              Poster posts a topic that ends in 2 days with a initial topic
              reward pool of 10 ether and a minimum investment of 1 ether.
            </li>
            <li>
              Fact Checker A creates an argument for Truth and votes Truth with
              the minimum 1 ether. (11 ether in topic reward pool)
            </li>
            <li>
              Fact Checker B sees the argument and agrees, voting for Truth with
              3 ether. (14 ether in topic reward pool)
            </li>
            <li>
              Fact Checker C creates an argument for Lie and votes Lie with the
              minimum 2 ether. (16 ether in topic reward pool)
            </li>
            <li>The topic voting period ends after 2 days.</li>
            <li>
              Fact Checker C views the results and recieves nothing for being in
              the minority.{" "}
            </li>
            <li>
              Fact Checker B views the results and recieves 1/(3+1) or 1/4 of
              the ether in the topic reward pool for being in the majority. (1/4
              * 16 = 4 ether)
            </li>
            <li>
              Fact Checker A views the results and recieves 3/(3+1) or 3/4 of
              the ether in the topic reward pool for being in the majority. (3/4
              * 16 = 12 ether)
            </li>
          </ol>
          <p>
            If the initial ether investment by the poster was 0 instead of 10,
            the total reward pool at the end of the voting period would be 6
            instead of 16. In this case, Fact Checker B would recieve 1/4 * 6 =
            1.5 ether and Fact Checker A would recieve 3/4 * 6 = 4.5 ether.
          </p>
        </p>

        <h2 id="participate">Interested in Participating?</h2>
        <Button primary fluid>
          <Link route="/getting-started">
            <a style={{ color: "white" }} className="item">
              Get Started Here
            </a>
          </Link>
        </Button>
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

export default HowItWorks;
