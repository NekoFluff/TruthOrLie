import React from "react";
import { Header, Segment, Icon } from "semantic-ui-react";

// import { Link } from "../routes";

export default props => {
  return (
    <Segment
      className="Site-footer"
      style={{ marginTop: "32px" }}
      inverted
      vertical
      color="black"
      textAlign="center"
    >
      {/* <Container fluid textAlign="center"> */}
      <Header inverted>&copy; Copyright 2020 | All rights reserved</Header>
      {/* <a href="https://www.facebook.com/" target="_blank">
          <Icon name="facebook big"/>
        </a> */}
      <a href="https://twitter.com/TruthOrLie8" target="_blank">
        <Icon name="twitter" className="big" />
      </a>
      {/* <a href="https://www.linkedin.com/company/c" target="_blank">
          <Icon name="linkedin big"/>
        </a> */}
      <a href="https://discord.gg/sCNpMAs" target="_blank">
        <Icon name="discord" className="big" />
      </a>
      {/* </Container> */}
    </Segment>
  );
};
