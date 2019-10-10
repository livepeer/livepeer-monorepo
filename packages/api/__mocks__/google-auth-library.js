export class OAuth2Client {
  verifyIdToken({ idToken, audience }) {
    if (audience !== 'EXPECTED_AUDIENCE') {
      throw new Error('bad audience')
    }
    if (idToken !== 'EXPECTED_TOKEN') {
      throw new Error('bad token')
    }
    var ticket = new Ticket()
    return ticket
  }
}

class Ticket {
  getPayload() {
    var item = {
      sub: 'mock_sub',
      name: 'Name LastName',
      email: 'email@livepeer.org',
      hd: 'livepeer.org',
    }
    return item
  }
}
