// React Google Analytics
import ReactGA from "react-ga";
const trackingId = "UA-157106142-1";

export const initGA = () => {
  console.log("Google Analytics initialized");
  ReactGA.initialize(trackingId);
};

export const logPageView = () => {
  console.log(`Logging pageview for ${window.location.pathname}`);
  ReactGA.set({
    page: window.location.pathname
  });
  ReactGA.pageview(window.location.pathname);
};

export const logEvent = (
  category = "",
  action = "",
  value = -1,
  label = "default"
) => {
  if (category && action) {
    // var eventData = { category, action, value, label };
    // if (value) {
    //   eventData[value] = value;
    // }
    // if (label) {
    //   eventData[label] = label;
    // }
    console.log("Logging Event:");
    console.log({ category, action, value, label });
    ReactGA.event({ category, action, value, label });
  }
};

export const logException = (description = "", fatal = false) => {
  if (description) {
    ReactGA.exception({ description, fatal });
  }
};
