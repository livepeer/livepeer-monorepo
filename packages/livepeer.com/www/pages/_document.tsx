import Document, { Html, Head, Main, NextScript } from "next/document";
import * as snippet from "@segment/snippet";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  renderSnippet() {
    const opts = {
      apiKey: process.env.SEGMENT_WRITE_KEY,
      // note: the page option only covers SSR tracking.
      // The Layout component is used to track other events using `window.analytics.page()`
      page: false
    };

    return snippet.min(opts);
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Inject the Segment snippet into the <head> of the document  */}
          {process.env.NODE_ENV === "production" && (
            <script
              dangerouslySetInnerHTML={{ __html: this.renderSnippet() }}
            />
          )}
        </Head>
        <body>
          <Main />
          <NextScript />
          {
            <script
              type="text/javascript"
              id="hs-script-loader"
              async
              defer
              src="//js.hs-scripts.com/6160488.js"
            />
          }
        </body>
      </Html>
    );
  }
}

export default MyDocument;
