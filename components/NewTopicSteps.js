import React from "react";
import { Icon, Step } from "semantic-ui-react";

const StepExampleGroup = () => (
  <Step.Group>
    <Step active>
      <Icon name="truck" />
      <Step.Content>
        <Step.Title>Topic</Step.Title>
        <Step.Description>Write your Topic</Step.Description>
      </Step.Content>
    </Step>

    <Step active>
      <Icon name="payment" />
      <Step.Content>
        <Step.Title>Billing</Step.Title>
        <Step.Description>Choose your account</Step.Description>
      </Step.Content>
    </Step>

    <Step disabled>
      <Icon name="info" />
      <Step.Content>
        <Step.Title>Confirm Details</Step.Title>
      </Step.Content>
    </Step>
  </Step.Group>
);

export default StepExampleGroup;
