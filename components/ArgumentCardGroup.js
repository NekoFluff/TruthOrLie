import React, { Component } from "react";
import { Card, Divider, Button } from "semantic-ui-react";
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
                  <Button
                    disabled={!props.canvote}
                    onClick={() => {
                      localStorage.setItem("argumentText", props.description);
                      localStorage.setItem("argumentIsTrue", props.istrue);
                      localStorage.setItem(
                        "argumentIndex",
                        props.argumentindex
                      );
                      console.log(
                        "Updated local storage with argument details"
                      );
                    }}
                  >
                    Vote
                  </Button>
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
