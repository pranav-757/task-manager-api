//const sendGridKey = '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'
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'hklearning1092@gmail.com',
        subject: "teststttt",
        text: 'this my test email'
    })
}

const sendGoodByeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'hklearning1092@gmail.com',
        subject: "Cancel mail",
        text: `Bye ${name}! hoppe you come back`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendGoodByeEmail
}