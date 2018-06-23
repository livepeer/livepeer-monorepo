import test from 'ava'
import { keccak_256 as keccak256 } from 'js-sha3'
import {
  createTree,
  equalTo,
  fromHex,
  getProof,
  getRoot,
  hashLeaf,
  hashParent,
  indexOf,
  merge,
  sort,
  toHex,
  verifyProof,
} from './utils'

console.clear()

test('fromHex', t => {
  const a = '4fe9367ef5dad459'
  t.true(fromHex(a) instanceof ArrayBuffer)
})

test('toHex', t => {
  const a = '4fe9367ef5dad459'
  const b = fromHex(a)
  t.is(a, toHex(b))
})

test('sort', t => {
  const a = '4fe9367ef5dad459'
  const b = '546266e73438ef2d'
  const order = sort(fromHex(a), fromHex(b))
  t.is(order, -1)
})

test('merge', t => {
  const a = fromHex('4fe9367ef5dad459')
  const b = fromHex('546266e73438ef2d')
  const c = fromHex('4fe9367ef5dad459546266e73438ef2d')
  t.deepEqual(merge(a, b), c)
})

test('equalTo', t => {
  const a = fromHex('4fe9367ef5dad459')
  const b = fromHex('4fe9367ef5dad459')
  const c = fromHex('546266e73438ef2d')
  t.true(equalTo(a, b))
  t.false(equalTo(a, c))
})

test('indexOf', t => {
  const xs = [
    '4fe9367ef5dad459ae9cc4265c69b1b10a4e1288',
    '546266e73438ef2486c6d004d4cb8995373512da',
    '1aa91cde8b0a6c31a2b01d3e85df06f000e54db5',
    '795ad2aac00df5585957ec4e3d1f9b814edaeefc',
    'a4d8beab188de098bcc73fe6f739cc46e047083f',
    'cb13f33e9ad5d923cee93778f238e1e047bfef37',
    '7a116846f9022ba1983a9eaa28b1ee7010243438',
  ].map(fromHex)
  t.is(3, indexOf(xs, xs[3]))
  t.is(-1, indexOf(xs, new ArrayBuffer(0)))
})

test('hashLeaf', t => {
  const addr = '4fe9367ef5dad459ae9cc4265c69b1b10a4e1288'
  const a = toHex(keccak256.buffer(addr))
  const b = toHex(hashLeaf(addr))
  t.is(a, b)
})

test('hashParent', t => {
  const addr0 = fromHex('4fe9367ef5dad459ae9cc4265c69b1b10a4e1288')
  const addr1 = fromHex('546266e73438ef2486c6d004d4cb8995373512da')
  const a = toHex(keccak256.buffer(merge(addr0, addr1)))
  const b = toHex(hashParent(addr0, addr1))
  const c = toHex(hashParent(addr1, addr0))
  t.is(a, b)
  t.is(a, c)
})

test('verifyProof', t => {
  const xs = [
    [
      fromHex('4fe9367ef5dad459ae9cc4265c69b1b10a4e1288'),
      fromHex('546266e73438ef2486c6d004d4cb8995373512da'),
    ],
    [
      fromHex('1111111111111111111111111111111111111111'),
      fromHex('0000000000000000000000000000000000000000'),
    ],
    [
      fromHex('0000000000000000000000000000000000000000'),
      fromHex('0000000000000000000000000000000000000000'),
    ],
  ]
  for (const [a, b] of xs) {
    const leafA = hashLeaf(a)
    const leafB = hashLeaf(b)
    const root = hashParent(leafA, leafB)
    const valid = verifyProof(a, leafB, root)
    t.true(valid)
  }
})

test('verify multiple levels', t => {
  const addresses = `
4fe9367ef5dad459ae9cc4265c69b1b10a4e1288
546266e73438ef2486c6d004d4cb8995373512da
1aa91cde8b0a6c31a2b01d3e85df06f000e54db5
795ad2aac00df5585957ec4e3d1f9b814edaeefc
a4d8beab188de098bcc73fe6f739cc46e047083f
cb13f33e9ad5d923cee93778f238e1e047bfef37
7a116846f9022ba1983a9eaa28b1ee7010243438
053f5ac1dabf7145b4f1ef5771b4685fd3ce011d
a00390e782c2c9c89e236387db1a04f6f3eb84ea
cba6146b3b2e265acb16b9a36a138093c520c27c
9dd473786029d95566de7f24e336f4d4e1db7155
0a4e595bd0d2d3ba722f5bb8bc75a68e3ba19fb4
d37865958148ff83f600fab452ccd3284ad7ca09
29f0baad700387bdb3374047f6f4dd52403131ea
00ac377e56d6833ddd1037a3f94dbca89b6eb4a8
8a9414801a7d01a947fc824c7bfd278d9d3c78c5
9cb37d3b4b42e9b58ef38ebe6201c98da21801c7
98e770b6cfc4105833776782e6ec7aff4f4a23c3
95b6833e13db0e6821abbdc6be969a15d32b41c9
2d9483047761b7a90d5acd2e7f728716c7db8e3c
4ceb65737faa2ef27d3dcee385770d3ad41e745d
7afdd0413775f4f2965e42619fd08cf13ee53c79
f154f148a7af7fcdc396ecba2764bdf524a88ae6
3bcd056ba3e95c854da619a1313fded89c314071
8afa75735244b998330005067fe25323f8b88682
8e456e0652c813a287603b6b160dad376dbfa027
264552cc9ea60abc01226d24dc372646671437d8
4ee79c1877c85c4fd9a454af67681bde980f434b
25cb58d97468a3ba51ad1f4981ec9c06ea8ab5ac
8fdc7945fb827a8dbd491280bb43618f16c8085c
1410e6a18ba04b2d3bb4bd31ca5237d531773459
5acb165017f4ab72bb7d41b578c635260c408bd2
737f98e530c037a03de1a83b24cb40bf90efc5bf
278865afafe29b22ff3c4f7df35f116f92df3886
0e9ff0504c760f18d83c2abffce150c730476a81
6ca99425f4ed68ceafa35c847262ce4066458dd3
97eec76fcfb5cdcff291e3a6d198b1e55a34f3eb
54c1817e3fcf822b137719b603d90066a2d66fae
6730c8d88163b7e9e1064e14c95d50727f6de403
e4da619feab5ae7ac784d67bbcde33d0e6978b10
ffe1b703a29cd2e574ee86f8a40b4395e39ba04a
793209dcbb894dc471ae8a0ee73fe0e1c1309ee2
a3a8af572ead1a75c25d3d70fec656dd8efa91a5
7ab96b8e8b142b798a55c954ebeb7fa7bf7e9c9c
a4fc2b10f0b48ea2747aa04d29108f1f5ccb7af8
ee3bed3431c600821218081562d367b52effa139
76b7b1889e6a6a34e9641e34a0096d81b2c45372
0c9685445e510a7dd2fcbfca38f4d6f13e759537
1cf049f968362ee1a15395ab8e8a9e6eaaf78a92
09abe837ae8bf0ede4bb5e1c9620d41f01ade934
f429cee31bb90678c9456371c3eebb604b508795
2fd3f283baebbf10538c68c93d2a5cb7018b5871
d6acf9c4887d9f564cc94fe607b40cfb3d02ff6d
794084147f0ba8c3b50ca3126ac0fffe82c9d93f
d456ff5a5a132971a2f09b08b0a3f593ccf208c0
f8e74680264b4dd763ab9e61240de02d786371d3
c35f30d3d1568d3ec0ce222d595b50f742405a99
01012c594ceb06de74b7295c739f1314735af95b
d2235317e988a6381675e71b105768587f17b8f2
27214767e05bb59992af5b2066f5dad9668a4544
80b25f6b096723287e12a2c4930d80dce10b530a
4e17f0941f5d1d246c329b3b8124901ab8969bdc
6e53744757a8375236892770db70aefbcd22e140
1f7b0836f85f171d9a6266f9e150d8e2184e8928
7d62878a7235e95d56f802f80835543cac711f90
860cd03ff1403d9a884ab3107a0976bfe5764a48
4f1f93600cbe6594955afa0edcccd510f0f37aa1
aff558d73f6b97d4717a31e6d81f01867ddaa345
0a1b2fa0cbb24dba1109ff5b4c1f5ced07c67afb
0b104e9d1a324e8adc24633d33056dde08ba2e30
07706af0c8e1cd4b4b01024dc7346b299b3e1c80
dda4e849a893fe5833e61a1321a8dff15c9406d2
b7922233fd13ba3e839d84fb2508c70775ca06f3
26d4121121e26f263eb447340385ee9655e42338
460290a34b0da95b28a63504d4a7c4ce78ea84b6
ca3c39fb9dd44a6dd85f8a542d60168e1541a343
fe47fc5e8a85840c6a995de57b8b72cb84e37ee1
21a11291741c3fad7b63d173ec85a9917b03d5df
d5e1221fa3b2617be2ae3be72689362dd90e9fc3
`
  const input = addresses
    .trim()
    .split('\n')
    .sort(sort)
    .map(fromHex)
    .reduce(merge, new ArrayBuffer(0))
  const treeA = createTree(input, n => {
    t.is(typeof n, 'number')
  })
  const treeB = createTree(input)
  t.deepEqual(treeA, treeB)
  const tree = treeA
  t.snapshot(tree, 'tree')
  const root = getRoot(tree)
  t.snapshot(root, 'root')
  const { byteLength } = input
  const addrByteLength = 20
  for (let i = 0; i < byteLength; i += addrByteLength) {
    const address = input.slice(i, i + addrByteLength)
    const index = indexOf(tree[0], hashLeaf(address))
    const proof = getProof(tree, index)
    t.snapshot({
      address,
      index,
      proof,
    })
  }
})
