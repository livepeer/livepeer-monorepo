import React from 'react'
import styled from 'styled-components'
import { X as XIcon } from 'react-feather'
import Modal from './Modal'
import Content from './Content'

const ifEnter = f => ({ keyCode }) => {
  if (keyCode === 13) f && f()
}

const BasicModal = ({ title, children, onOpen, onClose }) => {
  return (
    <Modal>
      <Backdrop
        role="button"
        tabindex="0"
        onClick={onClose}
        onKeydown={ifEnter(onClose)}
      >
        <Content
          background="#fff"
          width="50vw"
          style={{
            display: 'block',
            margin: 'auto',
            padding: 24,
            width: 440,
          }}
          onClick={e => e.stopPropagation()}
        >
          <h2>{title}</h2>
          {children}
        </Content>
      </Backdrop>
    </Modal>
  )
}

const Backdrop = styled.div`
  display: flex;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
  overflow: auto;
`

export default BasicModal
