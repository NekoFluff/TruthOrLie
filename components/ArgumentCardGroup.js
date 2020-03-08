import React, { Component } from "react";
import { Card, Divider, Button, Container, Label } from "semantic-ui-react";
import { Link } from "../routes";
import { renderMultilineText } from './../helpers/multiline';
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
              description=""
              extra={
                <React.Fragment>
                  {renderMultilineText(props.description)}
                  <hr></hr>
                  <Container textAlign="right">
                    {props.reputation && (
                      <Label.Group>
                        <Label color="blue">
                          {`${props.reputation} Reputation`}
                        </Label>
                      </Label.Group>
                    )}
                  </Container>
                  <Link
                    route={`/topics/${this.props.topicAddress}/arguments/${props.creator}/vote`}
                  >
                    <Button
                      disabled={props.canvote == "true" ? false : true}
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
                </React.Fragment>
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
