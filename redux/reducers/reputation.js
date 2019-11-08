import { UPDATE_REP_ADDRESS } from "../actionTypes";

const initialState = {
  reputationAddress: ""
};

const billing = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_REP_ADDRESS: {
      return action.payload;
    }
    default: {
      return state;
    }
  }
};

export default billing;
