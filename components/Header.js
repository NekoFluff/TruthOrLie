import React from "react";
import { Menu } from "semantic-ui-react";
import { Link } from "../routes";

export default props => {
  return (
    <Menu fixed="top">
      <Link route="/">
        <a className="item">TruthOrLie Alpha</a>
      </Link>
      <Menu.Menu position="right">
        <Link route="/privacy-policy">
          <a className="item">Privacy Policy</a>
        </Link>
        <Link route="/how-it-works">
          <a className="item">How It Works</a>
        </Link>
        <Link route="/getting-started">
          <a className="item">Getting Started</a>
        </Link>
        <Link route="/mine/topics">
          <a className="item">My Topics</a>
        </Link>
        <Link route="/topics/new">
          <a className="item">+</a>
        </Link>
      </Menu.Menu>
    </Menu>
  );
};
