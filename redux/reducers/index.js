import { combineReducers } from "redux";
import billing from "./billing";
import newTopic from "./newTopic";
import newArgument from "./newArgument";

export default combineReducers({ newTopic, billing, newArgument });
