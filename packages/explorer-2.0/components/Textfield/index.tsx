/** @jsx jsx */
import { jsx } from 'theme-ui'

export default ({
  disabled = false,
  autoFocus = false,
  required = false,
  defaultValue = undefined,
  value = undefined,
  inputRef = undefined,
  onChange = null,
  name = '',
  htmlFor = '',
  id = '',
  label,
  ...props
}) => (
  <div
    sx={{
      border: '0',
      margin: '0',
      display: 'inline-flex',
      padding: '0',
      position: 'relative',
      minWidth: '0',
      flexDirection: 'column',
      verticalAlign: 'top',
    }}
    {...props}
  >
    <label
      sx={{
        zIndex: '1',
        transform: 'translate(12px, 20px) scale(1)',
        pointerEvents: 'none',
        top: '0',
        left: '0',
        position: 'absolute',
        transition:
          'color 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms,transform 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms',
        display: 'block',
        transformOrigin: 'top left',
        color: 'text',
        padding: '0',
        fontSize: '1rem',
        fontWeight: '400',
        lineHeight: '1',
        letterSpacing: '0.00938em',
      }}
      data-shrink="false"
      htmlFor={htmlFor}
      id={id}
    >
      {label}
    </label>
    <div
      sx={{
        transition: 'background-color 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms',
        backgroundColor: 'rgba(255, 255, 255, 0.09)',
        borderTopLeftRadius: '4px',
        borderTopRightRadius: '4px',
        color: '#fff',
        cursor: 'text',
        display: 'inline-flex',
        position: 'relative',
        fontSize: '1rem',
        boxSizing: 'border-box',
        alignItems: 'center',
        lineHeight: '1.1875em',
        '&:before': {
          left: '0',
          right: '0',
          bottom: '0',
          content: '"\\00a0"',
          position: 'absolute',
          transition:
            'border-bottom-color 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
          borderBottom: '1px solid',
          borderColor: 'text',
          pointerEvents: 'none',
        },
        '&:after': {
          left: '0',
          right: '0',
          bottom: '0',
          content: '""',
          position: 'absolute',
          transform: 'scaleX(0)',
          transition: 'transform 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms',
          borderBottom: '2px solid',
          borderColor: 'primary',
          pointerEvents: 'none',
        },
      }}
    >
      <input
        disabled={disabled}
        autoFocus={autoFocus}
        required={required}
        defaultValue={defaultValue}
        value={value}
        onChange={onChange}
        ref={inputRef}
        name={name}
        sx={{
          padding: '27px 12px 10px',
          font: 'inherit',
          color: 'currentColor',
          width: '100%',
          border: '0',
          height: '1.1875em',
          margin: '0',
          display: 'block',
          minWidth: '0',
          background: 'none',
          boxSizing: 'content-box',
          animationName: 'MuiInputBase-keyframes-auto-fill-cancel',
          WebkitTapHighlightColor: 'transparent',
        }}
        id={id}
        type="text"
      />
    </div>
  </div>
)
