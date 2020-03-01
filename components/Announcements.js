import React, { Component } from "react";
import { Message } from "semantic-ui-react";
import { Link } from "../routes";

class Announcements extends Component {
  render() {
    return (
      <React.Fragment>
        <Message warning>
          <Message.Content>
            <Message.Header
              content={"Alpha Test - Rinkeby/Main Networks Only"}
            ></Message.Header>
            <Message.List>
              <Message.Item>
                This application currently only works on the Rinkeby and Main
                networks.
              </Message.Item>
              <Message.Item>
                Please switch on MetaMask if you haven't done so. Use the
                Rinkeby network when using <b>rinkebytruthorlie.info</b>. Use
                the Main network when using <b>truthorlie.info</b>.
              </Message.Item>
              <Message.Item>
                <b>
                  Questions? Check out our{" "}
                  <a href="https://discord.gg/sCNpMAs" target="_blank">
                    Discord
                  </a>
                  ,{" "}
                  <a href="https://twitter.com/TruthOrLie8" target="_blank">
                    Twitter
                  </a>
                  , and{" "}
                  <a
                    href="https://github.com/NekoFluff/TruthOrLie"
                    target="_blank"
                  >
                    Github
                  </a>
                </b>
              </Message.Item>
              <Message.Item>
                <b>
                  <Link route="/getting-started">
                    <a>Get Started Here</a>
                  </Link>
                </b>
              </Message.Item>
            </Message.List>
          </Message.Content>
        </Message>

        <Message warning>
          <Message.Content>
            <Message.Header content={"Our Privacy Policy"}></Message.Header>
            <Message.List>
              <Message.Item>
                <b>
                  Please read our{" "}
                  <Link route="/privacy-policy">
                    <a>privacy policy</a>
                  </Link>
                </b>
                . By using this website, you are consenting to the collection of
                user actions such as page views and clicks through google
                analytics.
              </Message.Item>
              <Message.Item>
                The information gathered will be used to guide the design
                process moving forward.
              </Message.Item>
              <Message.Item>
                It will also be used in a research study on the effectiveness of
                a blockchain incentivization system on croudsourcing fact
                checks.
              </Message.Item>
            </Message.List>
          </Message.Content>
        </Message>
      </React.Fragment>
    );
  }
}

export default Announcements;
