// TYPE_ROOT/next-mui-helper/index.d.ts

declare module "next-mui-helper/nextjs/makeNextDocument" {
  import { Theme } from "@material-ui/core";

  const makeNextDocument: (muiTheme?: Theme) => React.Component;

  export = makeNextDocument;
}

declare module "next-mui-helper/nextjs/makeNextApp" {
  import { Theme } from "@material-ui/core";
  const makeNextApp: (
    muiTheme?: Theme,
    layout?: React.Component
  ) => React.Component;

  export = makeNextApp;
}

declare module "next-mui-helper/mui/withParts" {
  import { Theme } from "@material-ui/core";

  const withParts: (
    muiTheme?: Theme,
    layout?: React.Component,
    enableNProgress?: boolean,
    enableCssBaseline?: boolean
  ) => <T extends React.ComponentClass<any>>(part: T) => typeof part;

  export = withParts;
}

declare module "next-mui-helper/mui/defaultTheme" {
  import { Theme } from "@material-ui/core";
  const defaultTheme: Theme;
  export = defaultTheme;
}
