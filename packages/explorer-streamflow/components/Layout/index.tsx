import * as React from "react";
import Head from "next/head";
import Header from "../Header";
import Sidebar from "../Sidebar";
import Grid from "@material-ui/core/Grid";

const Layout = ({ children, title = "Livepeer Explorer" }: any) => (
  <div>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>

    <div style={{ display: "flex", paddingTop: "72px" }}>
      <div style={{ width: "240px" }}>
        <Sidebar />
      </div>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12} lg={12}>
          {children}
        </Grid>
      </Grid>
    </div>
    <footer />
  </div>
);

export default Layout;
