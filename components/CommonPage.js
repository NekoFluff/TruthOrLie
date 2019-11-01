import React, { Component } from "react";
import Header from "./Header.js";
import { Container } from "semantic-ui-react";
import { Provider } from "react-redux";
import store from "../redux/store";
import Head from "next/head";
import CreateReputation from "./CreateReputation.js";

class CommonPage extends Component {
  state = {};

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Provider store={store}>
        <Container>
          <Head>
            <link
              rel="stylesheet"
              href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css"
            />
          </Head>

          <Header />
          <CreateReputation />
          {this.props.children}
          <h1>TODO: Footer</h1>
        </Container>
      </Provider>
    );
  }
}

export default CommonPage;
