/** @jsx jsx */
import { jsx, Flex, Styled } from 'theme-ui'

export default ({ children, ...props }) => {
  return (
    <Flex
      sx={{
        borderTop: '1px solid',
        borderColor: 'border',
        py: 2,
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
      {...props}
    >
      <Flex sx={{ alignItems: 'center' }}>
        <div
          sx={{
            borderRadius: 1000,
            backgroundColor: 'surface',
            width: 30,
            height: 30,
            mr: 2,
            border: '1px solid',
            borderColor: 'border',
          }}
        />
        <div>
          <Styled.h4>Title</Styled.h4>
          <span sx={{ fontSize: 0, color: 'muted' }}>Subtitle</span>
        </div>
      </Flex>
      <div>
        <span>cta1</span>
        <span>cta2</span>
      </div>
    </Flex>
  )
}
