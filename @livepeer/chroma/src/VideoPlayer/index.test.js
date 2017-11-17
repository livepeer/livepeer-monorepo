import React from 'react'
import { render } from 'enzyme'
import VideoPlayer from './index'

it('should render as expected', () => {
  const snap = render(
    <VideoPlayer src="http://www.streambox.fr/playlists/x36xhzz/x36xhzz.m3u8" />,
  )
  expect(snap).toMatchSnapshot()
  // wrapper.setProps({ count: 1 });
  // expect(wrapper).toMatchSnapshot()
})
