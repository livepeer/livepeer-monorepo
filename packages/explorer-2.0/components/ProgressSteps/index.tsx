import { styled } from "../../stitches.config";
import { transparentize } from "polished";
import Flex from "../Flex";
import Box from "../Box";

const Circle = styled("div", {
  minWidth: "20px",
  minHeight: "20px",
  backgroundColor: "$blue500",
  borderRadius: "50%",
  color: "$white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  lineHeight: "8px",
  fontSize: "12px",
  variants: {
    confirmed: {
      true: {
        bg: "$primary",
        color: "$black",
      },
    },
    inactive: {
      true: {
        bg: "$gray500",
      },
    },
  },
});

const CircleRow = styled("div", {
  width: "calc(100% - 20px)",
  display: "flex",
  alignItems: "center",
});

const Connector = styled("div", {
  width: "100%",
  height: "2px",
  background:
    "linear-gradient(90deg, rgba(33, 114, 229, 0.5) 0%, rgb(86, 90, 105) 80%)",
  opacity: 0.6,
});

interface ProgressCirclesProps {
  steps: boolean[];
  disabled?: boolean;
  css?: object;
}

/**
 * Based on array of steps, create a step counter of circles.
 * A circle can be enabled, disabled, or confirmed. States are derived
 * from previous step.
 *
 * An extra circle is added to represent the ability to swap, add, or remove.
 * This step will never be marked as complete (because no 'txn done' state in body ui).
 *
 * @param steps  array of booleans where true means step is complete
 */
const ProgressSteps = ({ steps, css = {}, ...props }: ProgressCirclesProps) => {
  return (
    <Flex css={{ px: "$5", justifyContent: "center", ...css }} {...props}>
      {steps.map((step, i) => {
        return (
          <CircleRow key={i}>
            <Circle confirmed={step}>{step ? "✓" : i + 1}</Circle>
            <Connector />
          </CircleRow>
        );
      })}
      <Circle inactive={!steps[steps.length - 1]}>{steps.length + 1}</Circle>
    </Flex>
  );
};

export default ProgressSteps;
