import { CHOOSE_BILLING } from "../actionTypes";

const initialState = {
  selectedAccount: "",
  initialTopicValue: ""
}

const billing = (state = initialState, action) => {
  switch (action.type) {
    case CHOOSE_BILLING: {
      return action.payload;
    }
    default: {
      return state;
    }
  }
};

export default billing;
