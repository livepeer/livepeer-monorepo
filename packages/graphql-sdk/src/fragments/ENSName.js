export default `
fragment ENSNameFragment on ENSName {
    id
    account {
        ...AccountFragment
    }
}
`
