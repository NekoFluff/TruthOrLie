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

export const logEvent = (category = "", action = "") => {
  if (category && action) {
    ReactGA.event({ category, action });
  }
};

export const logException = (description = "", factal = false) => {
  if (description) {
    ReactGA.exception({ description, fatal });
  }
};
