import { combineReducers } from "redux";
import billing from "./billing";
import newTopic from "./newTopic";

export default combineReducers({ newTopic, billing });
