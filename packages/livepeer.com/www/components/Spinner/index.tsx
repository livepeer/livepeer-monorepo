import { keyframes } from "@emotion/core";

const rotate = keyframes`
  100% {
    transform: rotate(360deg);
  }
`;

interface Props {
  loading?: boolean;
}

export default ({ loading, ...props }: Props) => (
  <div
    {...props}
    sx={{
      border: "3px solid",
      borderColor: "surface",
      borderRadius: "50%",
      borderTopColor: "primary",
      width: 26,
      height: 26,
      animation: `${rotate} 1s linear`,
      animationIterationCount: "infinite"
    }}
  ></div>
);
