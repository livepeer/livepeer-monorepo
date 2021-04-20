import React from "react";
import Box from "../Box";
import Flex from "../Flex";
import { Dialog } from "@reach/dialog";
import CloseIcon from "../../public/img/close.svg";

interface Props {
  isOpen?: boolean;
  children: React.ReactNode;
  title?: React.ReactNode;
  className?: string;
  showCloseButton?: boolean;
  clickAnywhereToClose?: boolean;
  onDismiss?: Function;
  Icon?: any;
}

const Index = ({
  isOpen = false,
  Icon,
  title,
  className,
  children,
  clickAnywhereToClose = true,
  showCloseButton = true,
  onDismiss,
}: Props) => {
  return (
    <>
      <Box
        as={Dialog}
        aria-label="Dialog"
        isOpen={isOpen}
        onDismiss={
          clickAnywhereToClose
            ? () => {
                document.body.style.overflow = "";
                onDismiss();
              }
            : () => (document.body.style.overflow = "")
        }
        className={className}
        css={
          title
            ? { maxWidth: 700, bg: "$surface", borderRadius: 16 }
            : {
                borderRadius: 16,
                margin: "40px auto",
                height: "calc(100vh - 80px)",
              }
        }
      >
        <Box css={{ position: "relative", p: "$4" }}>
          {title && (
            <Box css={{ position: "relative" }}>
              <Flex
                css={{
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: "$4",
                }}
              >
                {Icon && <Flex css={{ mr: "$3" }}>{Icon}</Flex>}
                <Box as="h3" css={{ width: "100%" }}>
                  {title}
                </Box>
                {showCloseButton && (
                  <Box
                    css={{
                      cursor: "pointer",
                      zIndex: 1,
                      right: 20,
                      top: 20,
                      color: "white",
                    }}
                  >
                    <CloseIcon onClick={onDismiss} />
                  </Box>
                )}
              </Flex>
            </Box>
          )}
          {children}
        </Box>
      </Box>
    </>
  );
};

export default Index;
