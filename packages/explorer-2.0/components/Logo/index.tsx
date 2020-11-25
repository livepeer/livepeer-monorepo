import Link from 'next/link'
import { useMemo, useRef, useEffect, useState, useCallback } from 'react'
import gsap from 'gsap'

type Props = {
  pushSx?: object
  isDark?: boolean
  isLink?: boolean
  disableHover?: boolean
  id?: string
}

const GOLDEN_RATIO = (1 + Math.sqrt(5)) / 2
const RECIPROCAL_GR = 1 / GOLDEN_RATIO
const DURATION = RECIPROCAL_GR * 0.5

const LivepeerLogo = ({
  pushSx,
  isDark,
  isLink = true,
  disableHover = false,
  id = '',
}: Props) => {
  const [hover, setHover] = useState(false)
  const svgRef = useRef(null)

  const handleMouseOver = useCallback(() => setHover(true), [])
  const handleMouseOut = useCallback(() => setHover(false), [])

  useEffect(() => {
    const node = svgRef.current
    if (node) {
      node.addEventListener('mouseover', handleMouseOver)
      node.addEventListener('mouseout', handleMouseOut)

      return () => {
        node.removeEventListener('mouseover', handleMouseOver)
        node.removeEventListener('mouseout', handleMouseOut)
      }
    }
  }, [svgRef])

  useEffect(() => {
    if (!svgRef.current) return

    const words = svgRef.current.querySelectorAll('.w-animate')
    const color1 = svgRef.current.querySelector('.w-color-1')
    const color2 = svgRef.current.querySelector('.w-color-2')
    const hexDark = isDark ? '#fff' : '#131418'
    const hexHover1 = isDark ? '#fefefe' : '#1f2027'
    const hexHover2 = isDark ? '#ffffff' : '#131418'

    gsap.to(color1, {
      duration: DURATION,
      ease: 'sine.inOut',
      attr: {
        'stop-color': hover ? hexHover1 : disableHover ? '#131418' : '#00A55F',
      },
    })

    gsap.to(color2, {
      duration: DURATION,
      ease: 'sine.inOut',
      attr: {
        'stop-color': hover ? hexHover2 : disableHover ? '#131418' : '#4CF1AC',
      },
    })

    gsap.to(words, {
      duration: DURATION,
      fill: hover ? (disableHover ? '#131418' : '#00EB88') : hexDark,
      stagger: {
        each: 0.03,
        from: 'end',
        ease: 'sine.inOut',
      },
    })
  }, [hover, svgRef])

  const markup = useMemo(
    () => (
      <svg
        viewBox="0 0 123 34"
        sx={{ width: '123px', height: '34px', ...pushSx }}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        ref={svgRef}
      >
        <path
          className="w-animate"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M123 9.87911L122.265 7.54623L115.451 9.92771L114.863 7.44903H112.363V26.5495H115.598V12.9896L123 9.87911Z"
          sx={{ fill: isDark ? 'background' : 'text' }}
        />
        <path
          className="w-animate"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M94.304 10.8572C95.6809 8.57488 98.287 6.87527 101.631 6.87527C104.139 6.87527 106.105 7.79792 107.581 9.25473C109.154 10.9543 110.088 13.4309 110.039 16.0046L109.99 17.947H96.2709C96.2709 19.6952 96.9594 21.5891 98.1395 22.7545C99.0246 23.6286 100.205 24.1142 101.68 24.1142C103.204 24.1142 104.483 23.6772 105.27 22.8516C105.81 22.3175 106.155 21.7833 106.401 20.7635H109.597C109.302 22.6574 108.171 24.4056 106.597 25.4739C105.22 26.3966 103.499 26.9307 101.68 26.9307C98.9263 26.9307 96.7135 25.8138 95.2383 24.0657C93.6156 22.2204 92.8289 19.6952 92.8289 16.9758C92.8289 14.6935 93.2222 12.654 94.304 10.8572ZM101.63 9.59395C98.139 9.59395 96.4179 12.4105 96.3196 15.227H106.646C106.646 13.8187 106.252 12.3619 105.466 11.3421C104.63 10.2738 103.351 9.59395 101.63 9.59395Z"
          sx={{ fill: isDark ? 'background' : 'text' }}
        />
        <path
          className="w-animate"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M74.9661 10.8565C76.343 8.57416 78.9491 6.87455 82.2929 6.87455C84.8007 6.87455 86.7676 7.79719 88.2428 9.25401C89.8163 10.9536 90.7506 13.4302 90.7014 16.0039L90.6522 17.9463H76.9331C76.9331 19.6945 77.6215 21.5884 78.8016 22.7538C79.6867 23.6279 80.8669 24.1135 82.342 24.1135C83.8664 24.1135 85.1449 23.6765 85.9317 22.8509C86.4726 22.3168 86.8168 21.7826 87.0626 20.7628H90.2588C89.9638 22.6567 88.8328 24.4049 87.2593 25.4732C85.8825 26.3958 84.1614 26.93 82.342 26.93C79.5884 26.93 77.3756 25.8131 75.9004 24.0649C74.2777 22.2196 73.491 19.6945 73.491 16.9751C73.491 14.6928 73.8843 12.6532 74.9661 10.8565ZM82.2919 9.59396C78.8006 9.59396 77.0795 12.4105 76.9812 15.227H87.3075C87.3075 13.8187 86.9141 12.3619 86.1273 11.3421C85.2914 10.2738 84.0129 9.59396 82.2919 9.59396Z"
          sx={{ fill: isDark ? 'background' : 'text' }}
        />
        <path
          className="w-animate"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M57.2321 10.0231C58.3569 8.134 60.8511 7.06837 63.0029 7.06837C65.3503 7.06837 67.2087 7.84338 68.3824 9.10277C70.2408 10.9434 71.17 13.8497 71.17 16.9982C71.17 20.292 70.1919 23.2951 68.2357 25.1358C66.9642 26.2983 65.2036 27.0733 62.954 27.0733C60.9 27.0733 58.4058 26.1046 57.3788 24.3608V34H54.1511V7.55275H56.6453L57.2321 10.0231ZM59.3364 23.152C60.1189 23.8301 61.0481 24.4114 62.4663 24.4114C66.7699 24.4114 67.8947 20.5848 67.8947 17.0972C67.8947 13.6097 66.7699 9.78306 62.4663 9.78306C61.0481 9.78306 60.1189 10.3643 59.3364 11.0425C57.7225 12.3987 57.1846 14.7238 57.1846 17.0972C57.1846 19.4707 57.7225 21.7473 59.3364 23.152Z"
          sx={{ fill: isDark ? 'background' : 'text' }}
        />
        <path
          className="w-animate"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M36.0904 10.8565C37.4672 8.57416 40.0734 6.87455 43.4171 6.87455C45.9249 6.87455 47.8919 7.79719 49.367 9.25401C50.9406 10.9536 51.8748 13.4302 51.8257 16.0039L51.7765 17.9463H38.0573C38.0573 19.6945 38.7457 21.5884 39.9259 22.7538C40.811 23.6279 41.9911 24.1135 43.4663 24.1135C44.9907 24.1135 46.2692 23.6765 47.0559 22.8509C47.5968 22.3168 47.941 21.7826 48.1869 20.7628H51.3831C51.0881 22.6567 49.9571 24.4049 48.3836 25.4732C47.0067 26.3958 45.2857 26.93 43.4663 26.93C40.7126 26.93 38.4999 25.8131 37.0247 24.0649C35.402 22.2196 34.6152 19.6945 34.6152 16.9751C34.6152 14.6928 35.0086 12.6532 36.0904 10.8565ZM43.4164 9.59396C39.9251 9.59396 38.2041 12.4105 38.1057 15.227H48.432C48.432 13.8187 48.0386 12.3619 47.2518 11.3421C46.4159 10.2738 45.1374 9.59396 43.4164 9.59396Z"
          sx={{ fill: isDark ? 'background' : 'text' }}
        />
        <path
          className="w-animate"
          d="M6.57544 7.44903H9.86318V26.5495H6.57544V7.44903Z"
          sx={{ fill: isDark ? 'background' : 'text' }}
        />
        <path
          className="w-animate"
          d="M6.57573 0H10.2503V3.62908H6.57573V0Z"
          sx={{ fill: isDark ? 'background' : 'text' }}
        />
        <path
          className="w-animate"
          d="M0 0H3.28774V26.5496H0V0Z"
          sx={{ fill: isDark ? 'background' : 'text' }}
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M16.8261 7.44915H13.1516V11.0782H16.8261V7.44915ZM25.3333 7.44915H21.6588V11.0782H25.3333V7.44915ZM25.3332 23.1123H21.6587V26.7414H25.3332V23.1123ZM29.9775 7.44915H33.652V11.0782H29.9775V7.44915ZM25.917 15.2807H29.5915V18.9098H25.917V15.2807ZM21.0796 15.2807H17.405V18.9098H21.0796V15.2807Z"
          fill={`url(#${id}-logo-svg-paint0_linear)`}
        />
        <defs>
          <linearGradient
            id={`${id}-logo-svg-paint0_linear`}
            x1="13.1519"
            y1="17.0847"
            x2="33.6519"
            y2="17.0848"
            gradientUnits="userSpaceOnUse"
          >
            <stop
              className="w-color-1"
              stopColor={disableHover ? '#131418' : '#00A55F'}
            />
            <stop
              className="w-color-2"
              offset="1"
              stopColor={disableHover ? '#131418' : '#4CF1AC'}
            />
          </linearGradient>
        </defs>
      </svg>
    ),
    [pushSx, isDark],
  )

  if (!isLink) return markup
  return (
    <Link href="/" passHref>
      <a>{markup}</a>
    </Link>
  )
}

export default LivepeerLogo
