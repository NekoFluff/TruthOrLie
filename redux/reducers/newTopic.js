import { NEW_TOPIC } from "../actionTypes";

const initialState = {
  topicContent: "",
  minimumInvestment: "",
  endDate: ""
};

export default function(state = initialState, action) {
  switch (action.type) {
    case NEW_TOPIC: {
      return action.payload;
    }
    default:
      return state;
  }
}
