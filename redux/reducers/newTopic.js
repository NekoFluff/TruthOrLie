import { NEW_TOPIC } from "../actionTypes";

const initialState = {
  topicContent: "",
  minimumInvestment: "",
  hoursAvailable: ""
};

export default function(state = initialState, action) {
  switch (action.type) {
    case NEW_TOPIC: {
      // const { topicContent, minimumInvestment, hoursAvailable } = action.payload;
      return action.payload;
    }
    default:
      return state;
  }
}
