declare module "@theme-ui/components";
declare module "*.gql" {
  const content: any;
  export default content;
}
declare module "*.svg" {
  const content: any;
  export default content;
}

declare module "*.mdx" {
  let MDXComponent: (props: any) => JSX.Element;
  export default MDXComponent;
}
