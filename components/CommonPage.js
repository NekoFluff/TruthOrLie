import React, { Component } from "react";
import Header from "./Header.js";
import Footer from "./Footer.js";
import { Container } from "semantic-ui-react";
import { Provider } from "react-redux";
import store from "../redux/store";
import CreateReputation from "./CreateReputation.js";

class CommonPage extends Component {
  state = {};

  constructor(props) {
    super(props);
  }

  render() {
    return (

      
      <Provider store={store}>
      <div class="Site">
          <Container className="Site-content">
            <Header />
            <CreateReputation />
            {this.props.children}
          </Container>
        <Footer  />
      </div>
      </Provider>
    );
  }
}

export default CommonPage;
