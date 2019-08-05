import Link from "next/link";
//import { FiCpu, MdPerson, FaInfo } from 'react-icons/all'
import { Root, NavItem } from "./styles";

export default () => (
  <Root>
    <Link href="/" passHref>
      <NavItem>
        {/* <FaInfo style={{ width: 12, height: 12, marginRight: 8 }} /> About */}
      </NavItem>
    </Link>
    <div style={{ height: 16, width: 1, backgroundColor: "white" }} />
    <Link href="/" passHref>
      <NavItem active>
        {/* <FiCpu style={{ width: 12, height: 12, marginRight: 8 }} /> Transcoders */}
      </NavItem>
    </Link>
    <div style={{ height: 16, width: 1, backgroundColor: "white" }} />
    <Link href="/" passHref>
      <NavItem>
        {/* <MdPerson style={{ width: 16, height: 16, marginRight: 8 }} /> */}
        Account
      </NavItem>
    </Link>
  </Root>
);
