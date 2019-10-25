import { NEW_ARGUMENT } from "../actionTypes";

const initialState = {
  argument: "",
  isTrue: ""
};

export default function(state = initialState, action) {
  switch (action.type) {
    case NEW_ARGUMENT: {
      return action.payload;
    }
    default:
      return state;
  }
}
