import React, { Component } from "react";
import { Segment, Card, Divider } from "semantic-ui-react";
import { Link } from "../routes";

class ArgumentCardGroup extends Component {
  state = {};
  render() {
    return (
      <div>
        {this.props.arguments.map((props, index, images) => (
          <React.Fragment key={index}>
            <Card
              raised
              fluid
              {...props}
              extra={
                <Link
                  route={`/topics/${this.props.topicAddress}/arguments/${props.creator}/vote`}
                >
                  <a>Vote</a>
                </Link>
              }
            />
            {index !== images.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </div>
    );
  }
}

export default ArgumentCardGroup;
