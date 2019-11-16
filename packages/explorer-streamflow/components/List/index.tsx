/** @jsx jsx */
import { jsx } from 'theme-ui'

interface Props {
  onScroll?: React.UIEventHandler
  header?: JSX.Element
  children: JSX.Element[] | JSX.Element
}

export default ({ header = null, onScroll, children, ...props }: Props) => (
  <div onScroll={onScroll} sx={{ width: '100%' }} {...props}>
    {header && (
      <div sx={{ pb: 2, borderBottom: '1px solid', borderColor: 'border' }}>
        {header}
      </div>
    )}
    <div>{children}</div>
  </div>
)
