const PUB = "1c4ce92f94981b971cce9d54b14acd87"
const PVT = "eff569d7b52ac9f248295184c465cf1b"

const Mailjet = require('node-mailjet');
const mailjet = Mailjet.apiConnect(
  PUB,
  PVT
);

const request = mailjet
        .post('send', { version: 'v3.1' })
        .request({
          Messages: [
            {
              From: {
                Email: "pilot@mailjet.com",
                Name: "Mailjet Pilot"
              },
              To: [
                {
                  Email: "passenger1@mailjet.com",
                  Name: "passenger 1"
                }
              ],
              Subject: "Your email flight plan!",
              TextPart: "Dear passenger 1, welcome to Mailjet! May the delivery force be with you!",
              HTMLPart: "<h3>Dear passenger 1, welcome to <a href=\"https://www.mailjet.com/\">Mailjet</a>!</h3><br />May the delivery force be with you!"
            }
          ]
        })
