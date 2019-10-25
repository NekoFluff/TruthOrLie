import React from "react";
import { Icon, Step } from "semantic-ui-react";

const NewArgumentSteps = props => {
  let activeIndex = props["active"] || 0;

  return (
    <Step.Group fluid>
      <Step active={activeIndex > 0}>
        <Icon name="paragraph" />
        <Step.Content>
          <Step.Title>Argument</Step.Title>
          <Step.Description>Argue your stance</Step.Description>
        </Step.Content>
      </Step>

      <Step active={activeIndex > 1}>
        <Icon name="payment" />
        <Step.Content>
          <Step.Title>Billing</Step.Title>
          <Step.Description>Choose your account</Step.Description>
        </Step.Content>
      </Step>

      <Step active={activeIndex > 2}>
        <Icon name="info" />
        <Step.Content>
          <Step.Title>Confirm Details</Step.Title>
        </Step.Content>
      </Step>
    </Step.Group>
  );
};

export default NewArgumentSteps;
