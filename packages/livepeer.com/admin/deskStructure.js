import S from "@sanity/desk-tool/structure-builder";
import { MdDashboard, MdSettings } from "react-icons/md";

// We filter document types defined in structure to prevent
// them from being listed twice
const hiddenDocTypes = listItem =>
  !["page", "route", "site-config"].includes(listItem.getId());

export default () =>
  S.list()
    .title("Site")
    .items([
      S.listItem()
        .title("Site config")
        .icon(MdSettings)
        .child(
          S.editor()
            .id("config")
            .schemaType("site-config")
            .documentId("global-config")
        ),
      S.listItem()
        .title("Pages")
        .icon(MdDashboard)
        .schemaType("page")
        .child(S.documentTypeList("page").title("Pages"))
      // S.listItem()
      //   .title('Routes')
      //   .schemaType('route')
      //   .child(S.documentTypeList('route').title('Routes')),
      // ...S.documentTypeListItems().filter(hiddenDocTypes)
    ]);
