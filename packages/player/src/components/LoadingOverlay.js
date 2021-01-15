import React from "react";
import styled, { keyframes, css } from "styled-components";

// Pass `true` for no overlay, `false` for "currently ofline", `null` for "loading"
export default function LoadingOverlay({ live }) {
  if (live === true) {
    return null;
  }
  return (
    <LoadingContainer>
      <FadeInOut loading={live === null}>
        <p>
          {live === null
            ? "L O A D I N G ..."
            : "This broadcaster is currently offline"}
        </p>
      </FadeInOut>
    </LoadingContainer>
  );
}

const LoadingContainer = styled.div`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  background-color: #000;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 0;
  color: #fff;
  z-index: 2;
`;

const fadeInOut = keyframes`
  from { opacity: 1; }
  to { opacity: .25; }
`;

const FadeInOut = styled.div`
  ${({ loading }) =>
    !loading
      ? ""
      : css`
          animation: ${fadeInOut} 2s linear infinite alternate;
        `};
`;
