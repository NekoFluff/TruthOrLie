import {
  NEW_TOPIC,
  CHOOSE_BILLING,
  NEW_ARGUMENT,
  UPDATE_REP_ADDRESS
} from "./actionTypes";

export const newTopic = content => ({
  type: NEW_TOPIC,
  payload: content
});

export const chooseBilling = content => ({
  type: CHOOSE_BILLING,
  payload: content
});

export const newArgument = content => ({
  type: NEW_ARGUMENT,
  payload: content
});

export const updateReputationAddress = content => ({
  type: UPDATE_REP_ADDRESS,
  payload: content
});

// export const setFilter = filter => ({ type: SET_FILTER, payload: { filter } });
