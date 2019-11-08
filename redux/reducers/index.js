import { combineReducers } from "redux";
import billing from "./billing";
import newTopic from "./newTopic";
import newArgument from "./newArgument";
import reputation from "./reputation";

export default combineReducers({ newTopic, billing, newArgument, reputation });
