import { createMuiTheme as create } from '@material-ui/core/styles'

export const createMuiTheme = (context: any) => {
  return create({
    palette: {
      primary: {
        main: context.theme.colors.background,
      },
      secondary: {
        main: context.theme.colors.text,
      },
      background: {
        default: context.theme.colors.background,
        paper: context.theme.colors.background,
      },
      text: {
        primary: context.theme.colors.text,
        secondary: context.theme.colors.text,
      },
      action: {
        active: context.theme.colors.primary,
      },
    },
    typography: {
      fontFamily: context.theme.fonts.body,
    },
    overrides: {
      MuiTypography: {
        h6: {
          fontWeight: 'bold',
          lineHeight: 'initial',
          fontSize: 32,
        },
      },
      MuiTableSortLabel: {
        root: {
          fontSize: 14,
        },
        icon: {
          fontSize: 14,
        },
      },
      MuiToolbar: {
        regular: {
          paddingRight: '0',
          paddingLeft: '0',
          minHeight: 'initial',
          width: '100%',
          ['@media (min-width: 600px)']: {
            minHeight: 'initial',
          },
          ['@media (min-width: 0px) and (orientation: landscape)']: {
            minHeight: 'initial',
          },
        },
      },
      MuiInput: {
        underline: {
          '&:before': {
            borderBottom: '1px solid rgba(255, 255, 255, 0.42)',
          },
        },
      },
      MuiTableRow: {
        hover: {
          '&:hover': {
            cursor: 'initial !important',
            backgroundColor: `${context.theme.colors.surface} !important`,
            transition: 'background-color .2s, color .2s',
          },
          '&:hover a': {
            borderBottom: `1px solid`,
            borderColor: 'rgba(255, 255, 255, .4) !important',
          },
        },
        footer: {
          '&:hover': {
            backgroundColor: 'initial',
          },
        },
      },
      MuiTableCell: {
        head: {
          padding: 20,
        },
        root: {
          borderBottom: 0,
          padding: '14px 20px 14px 20px',
          fontSize: 14,
          '&:first-child': {
            paddingLeft: 32,
          },
          '&:last-child': {
            paddingRight: 32,
          },
        },
      },
      MuiPaper: {
        root: {
          width: '100%',
        },
        elevation2: {
          boxShadow: 'none',
        },
      },
    },
  })
}
