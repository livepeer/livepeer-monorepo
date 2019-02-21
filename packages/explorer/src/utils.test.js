import { formatBalance } from './utils'

describe('formatBalance', () => {
  it('should handle numbers with <= 18 decimals', () => {
    const cases = [
      ['19555555555555555555', '19.555555555555555555'],
      ['19555550000000000000', '19.55555'],
      ['13000000000000000000', '13'],
      ['00000000000000000000000001', '0.000000000000000001'],
      ['999999999999999999', '0.999999999999999999'],
    ]
    for (const [input, expected] of cases) {
      expect(formatBalance(input)).toEqual(expected)
    }
  })
})
