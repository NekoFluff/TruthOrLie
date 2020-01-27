import React from "react";
import Document, { Head, Main, NextScript } from "next/document";

// ---------------------------------------------
export default class CustomDocument extends Document {
  render() {
    return (
      <html lang="en-US">
        <Head>
          <link
            rel="stylesheet"
            href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css"
          />

          <link rel="stylesheet" href="/static/css/site.css" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
