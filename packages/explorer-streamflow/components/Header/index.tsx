import Link from "next/link";
import { Root, Wrapper, NavGroup, Logo } from "./styles";
import Chip from "../Chip";
import Nav from "../Nav";
import RoundBar from "../RoundBar";
import Container from "@material-ui/core/Container";
import MetaMaskButton from "../MetaMaskButton";

export default () => (
  <Root>
    <Container>
      <Wrapper>
        <Link href="/" passHref>
          <Logo src="/static/img/logo.svg" />
        </Link>
        <RoundBar />
      </Wrapper>
      <NavGroup>
        <MetaMaskButton />
        <Nav />
        <Chip variant="outline">
          <svg
            style={{ marginRight: "8", width: 12, height: 12 }}
            width="16px"
            height="16px"
            viewBox="0 0 16 16"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
          >
            <title>Metamask</title>
            <g
              id="Page-1"
              stroke="none"
              strokeWidth="1"
              fill="none"
              fillRule="evenodd"
            >
              <g
                id="Desktop"
                transform="translate(-880.000000, -30.000000)"
                fill="currentColor"
              >
                <g id="Group-2" transform="translate(870.000000, 23.000000)">
                  <g id="metamask" transform="translate(10.000000, 7.000000)">
                    <path
                      d="M0.809777778,0 L0,2.44144227 L0.529777778,5.03137524 L0.186666667,5.30376003 L0.684444444,5.69821693 L0.305777778,5.99884229 L0.809777778,6.46344511 L0.489777778,6.6839037 L1.22222222,7.54934033 L0.137777778,11.0566361 L1.15822222,14.5848846 L4.82044444,13.6055747 L6.76444444,15.1578947 L9.19733333,15.1578947 L11.3155556,13.5673133 L14.8417778,14.5848846 L15.8631111,11.0557251 L15.8675556,11.0557251 L14.7777778,7.54934033 L15.5093333,6.6839037 L15.1893333,6.46435609 L15.6942222,5.99975327 L15.3155556,5.69912792 L15.8133333,5.30376003 L15.4702222,5.03046425 L16,2.44144227 L15.1893333,0 L10.0888889,1.91944734 L5.912,1.91944734 L0.809777778,0 Z M9.95111111,8.60972794 L12.0346667,9.61454541 L9.11911111,10.4754271 L9.95111111,8.60972794 Z M3.96533333,9.61181245 L6.04977778,8.60972794 L6.88177778,10.4754271 L3.96533333,9.61181245 Z M6.76622222,12.4795961 L7.128,12.2664254 L8.872,12.2664254 L9.21244444,12.490528 L9.32711111,13.7932378 L6.64711111,13.7932378 L6.76622222,12.4795961 Z"
                      id="Shape"
                    />
                  </g>
                </g>
              </g>
            </g>
          </svg>
          Metamask
        </Chip>
      </NavGroup>
    </Container>
  </Root>
);
