import { Box, Flex } from "@theme-ui/components";
import Link from "next/link";
import { useState } from "react";
import { Styled } from "theme-ui";
import { useRouter } from "next/router";

const listItems = [
  {
    label: "Understanding RTMP ingest vs segment based transcoding",
    href: "/docs"
  },
  {
    label: "How to live stream with RTMP ingest",
    open: true,
    children: [
      {
        label: "How to create a stream",
        href: "/docs/rtmp/create-a-stream"
      },
      {
        href: "/docs/rtmp/stream-page-specifications",
        label: "Understanding the stream page specifications"
      },
      {
        href: "/docs/rtmp/broadcast-a-stream-session",
        label: "How to broadcast a stream session"
      },
      {
        href: "/docs/rtmp/stream-rendition-properties",
        label: "How to set stream rendition properties"
      },
      {
        href: "/docs/rtmp/playback-a-stream",
        label: "How to playback a stream"
      },
      {
        href: "/docs/rtmp/delete-a-stream",
        label: "How to delete a stream"
      }
    ]
  },
  {
    label: "How to live transcode with .ts segment based ingest",
    children: [
      {
        href: "/docs/segment-based-ingest/authentication",
        label: "How to authenticate with your API key"
      },
      {
        href:
          "/docs/segment-based-ingest/create-a-stream-and-define-renditions",
        label: "How to create a stream and define renditions"
      },
      {
        href: "/docs/segment-based-ingest/get-a-list-of-broadcasters",
        label: "How to get a list of broadcasters"
      },
      {
        href: "/docs/segment-based-ingest/transcode-ts-segments",
        label: "How to transcode .ts segments"
      },
      {
        href: "/docs/stream-status",
        label: "How to understand stream status"
      }
    ]
  },
  {
    label: "How do you manage API keys",
    children: [
      {
        href: "/docs/api-keys/when-do-you-need-an-API-key",
        label: "When do you need an API key?"
      },
      {
        href: "/docs/api-keys/create-an-api-key",
        label: "How to create an API key"
      },
      {
        href: "/docs/api-keys/delete-an-api-key",
        label: "How to delete an API key"
      }
    ]
  }
];

export default () => {
  const { asPath } = useRouter();
  return (
    <Box sx={{ a: { textDecoration: "none" } }}>
      <Styled.h5 as="h1" sx={{ mb: 3 }}>
        Documentation
      </Styled.h5>
      {listItems.map((listItem, i) => {
        if (listItem?.children) {
          return (
            <Category
              active={listItem.children.some(l => l.href === asPath)}
              label={listItem.label}
              open={
                listItem?.open || listItem.children.some(l => l.href === asPath)
              }
            >
              {listItem.children.map(listItem => {
                return (
                  <ListItem
                    active={asPath === listItem.href}
                    href={listItem.href}
                    label={listItem.label}
                  />
                );
              })}
            </Category>
          );
        } else {
          return (
            <ListItem
              active={asPath === listItem.href}
              href={listItem.href}
              label={listItem.label}
            />
          );
        }
      })}
    </Box>
  );
};

function Category({ label, open = false, active, children }) {
  const [isOpen, setIsOpen] = useState(open);
  return (
    <Box sx={{ mb: 3 }}>
      <Flex
        onClick={() => (isOpen ? setIsOpen(false) : setIsOpen(true))}
        sx={{ cursor: "pointer", alignItems: "center" }}
      >
        <svg
          sx={{
            mr: 3,
            ml: "1px",
            transform: isOpen ? "rotate(90deg)" : "rotate(0deg)"
          }}
          width="6"
          height="10"
          viewBox="0 0 6 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1.4 8.56L4.67 5M1.4 1.23L4.66 4.7"
            stroke="#999"
            stroke-linecap="square"
          ></path>
        </svg>
        <Box sx={{ fontWeight: active ? "heading" : "body" }}>{label}</Box>
      </Flex>
      <Box sx={{ borderLeft: "1px solid", borderColor: "#eaeaea", pl: 3 }}>
        <Box sx={{ display: isOpen ? "block" : "none" }}>{children}</Box>
      </Box>
    </Box>
  );
}

function ListItem({ href, label, active }) {
  return (
    <Flex
      sx={{
        alignItems: "center",
        my: 3,
        ":before": {
          content: '""',
          flexBasis: 4,
          flexShrink: 0,
          display: "block",
          width: 4,
          height: 4,
          mr: 3,
          borderRadius: "50%",
          background: "rgb(102, 102, 102)"
        }
      }}
    >
      <Link href={href} as={href} passHref>
        <a
          sx={{
            fontWeight: active ? "heading" : "body",
            color: active ? "black" : "#444444"
          }}
        >
          {label}
        </a>
      </Link>
    </Flex>
  );
}
