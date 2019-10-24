import { NEW_TOPIC, CHOOSE_BILLING } from './actionTypes';


export const newTopic = content => ({
  type: NEW_TOPIC,
  payload: content
});

export const chooseBilling = content => ({
  type: CHOOSE_BILLING,
  payload: content
})

// export const toggleTodo = id => ({
//   type: TOGGLE_TODO,
//   payload: { id }
// });

// export const setFilter = filter => ({ type: SET_FILTER, payload: { filter } });
