export default {
  title: "Simple Portable Text",
  name: "simplePortableText",
  type: "array",
  of: [
    {
      title: "Block",
      type: "block",
      styles: [],
      lists: [],
      marks: {
        decorators: [
          { title: "Strong", value: "strong" },
          { title: "Emphasis", value: "em" },
          { title: "Code", value: "code" }
        ],
        annotations: [{ type: "link" }, { type: "internalLink" }]
      }
    },
    {
      type: "embedHTML"
    }
  ]
};
