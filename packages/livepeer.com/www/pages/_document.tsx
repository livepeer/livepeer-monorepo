import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="en">
        <style jsx global>{`
          html,
          body,
          #__next {
            height: 100%;
          }
        `}</style>
        <Head />
        <body>
          <Main />
          <NextScript />
          <script
            type="text/javascript"
            id="hs-script-loader"
            async
            defer
            src="//js.hs-scripts.com/6160488.js"
          />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
