import { poll } from "./monitor";

if (!module.parent) {
  poll();
}
