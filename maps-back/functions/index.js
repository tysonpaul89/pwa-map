const functions = require('firebase-functions')
const express = require('express')
const webPush = require('web-push')
const bodyParser = require('body-parser')
const Datastore = require('nedb')
const db = new Datastore()
const app = express()
const cors = require('cors')
const vapidKeys = {
  'publicKey': 'BPHGp-49DAF9-dTgo3G-MF2-ukiWhBn0wsOlX86nfi26Qa5ysrPc7wQH_RVp9MmcXfZjpM2fpZPAIi3XmFJe9X8',
  'privateKey': 'SSr4k_6re6Xb90hbsAjaeRqj2lr7A3loRlXYmLRaZgY'
}

app.use(cors())

webPush.setVapidDetails(
  'mailto:go4chacko@gmail.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
)

app.use(bodyParser.json())

const notificationPayload = {
  notification: {
    title: 'Angular News',
    body: 'Newsletter Available!',
    icon: 'assets/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [{
      action: 'explore',
      title: 'Go to the site'
    }]
  }
}

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

app.get('/hello', (req, res) => {
  res.json({
    message: 'Hello World'
  })
})

app.post('/save-subscription', (req, res) => {
  db.insert(req.body, (err, newDoc) => {
    if (err) {
      throw new Error(err)
    }
    res.json({
      subscriptionId: newDoc._id
    })
  })
})

app.post('/send-notification', (req, res) => {
  if (req.body.subscriptionId !== undefined && req.body.message !== undefined) {
    db.findOne({_id: req.body.subscriptionId}, (err, subscription) => {
      if (err) {
        throw new Error(err)
      }
      console.log(subscription)
      if (subscription._id !== undefined) {
        delete subscription._id
        webPush.sendNotification(
          subscription, JSON.stringify(notificationPayload))
        res.json(subscription)
      } else {
        res.json({
          message: 'Oops! :( subscription data not found'
        })
      }
    })
  } else {
    res.status(404).json({
      message: 'Either subscription id or message is empty'
    })
  }
})

exports.app = functions.https.onRequest(app)
