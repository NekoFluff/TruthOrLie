import React, { Component } from "react";
import Header from "./Header.js";
import Footer from "./Footer.js";
import { Container } from "semantic-ui-react";
import { Provider } from "react-redux";
import store from "../redux/store";
import CreateReputation from "./CreateReputation.js";
import Announcements from "./Announcements.js";
import { logPageView, initGA } from "../helpers/analytics.js";

class CommonPage extends Component {
  state = {};

  componentDidMount() {
    if (!window.GA_INITIALIZED) {
      initGA();
      window.GA_INITIALIZED = true;
    }
    logPageView();
  }

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Provider store={store}>
        <div className="Site">
          <Header />
          <Container className="Site-content" style={{ paddingTop: 60 }}>
            <CreateReputation />
            <Announcements />
            {this.props.children}
          </Container>
          <Footer />
        </div>
      </Provider>
    );
  }
}

export default CommonPage;
