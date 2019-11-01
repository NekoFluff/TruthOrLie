import React from "react";
import { Menu } from "semantic-ui-react";
import { Link } from "../routes";

export default props => {
  return (
    <Menu style={{ marginTop: "10px" }}>
      <Link route="/">
        <a className="item">TruthOrLie</a>
      </Link>
      <Menu.Menu position="right">
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
