import React from 'react'
import styled from 'styled-components'
import { X as XIcon } from 'react-feather'
import Modal from './Modal'
import Content from './Content'

const ifEnter = f => ({ keyCode }) => {
  if (keyCode === 13) f && f()
}

const BasicModal = ({ closeIcon, title, children, onOpen, onClose }) => {
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
            width: 600,
          }}
          onClick={e => e.stopPropagation()}
        >
          {closeIcon && (
            <XIcon
              style={{
                cursor: 'pointer',
                position: 'absolute',
                top: 16,
                right: 16,
              }}
              onClick={() => onClose()}
              size={24}
            />
          )}
          {title && <h2 style={{ marginTop: 0 }}>{title}</h2>}
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
  transition: all 1s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  &.modal-enter,
  &.modal-exit {
    opacity: 0;
    > div {
      transform: translateY(100vh);
      transition: all 1s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }
  }
  &.modal-enter.modal-enter-active {
    opacity: 1;
    > div {
      transform: translateY(0);
    }
  }
`

export default BasicModal
