export default {
  setApiKey(apiKey) {
    if (!apiKey) {
      throw new Error('missing sendgrid api key')
    }
  },

  send(emailConfirmation) {
    const personalizations = emailConfirmation.personalizations[0]
    if (!personalizations.to[0]['email']) {
      throw new Error('missing send to email')
    }

    if (!personalizations.dynamic_template_data.buttonUrl) {
      throw new Error('missing confirmation email buttonUrl')
    }

    if (!emailConfirmation.template_id) {
      throw new Error('missing template id')
    }

    if (!emailConfirmation.from['email'] || !emailConfirmation.from['name']) {
      throw new Error('missing send from email or name')
    }
  },
}
