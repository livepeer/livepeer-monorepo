import * as React from 'react'
import ReactTooltip from 'react-tooltip'

const Tooltip = ({
  children,
  id = `${performance.now()}`,
  text,
  tooltipProps,
  type = 'medium',
}) => (
  <React.Fragment>
    {React.cloneElement(children, {
      'data-for': id,
      'data-tip': true,
      'data-event': 'mouseover touchdown focus',
      'data-event-off': 'mouseout touchdown blur',
      // don't delay on small devices that are probably touch-enabled
      'data-delay-show': window.innerWidth < 960 ? '0' : '500',
      ...tooltipProps,
    })}
    <ReactTooltip
      className={`tooltip-${type}`}
      id={id}
      place="top"
      type="dark"
      effect="float"
    >
      {text}
    </ReactTooltip>
  </React.Fragment>
)

export default Tooltip
