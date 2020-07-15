require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { StreamChat } = require('stream-chat');
const AWS = require('aws-sdk');
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// initialize Stream Chat SDK

const serverSideClient = new StreamChat(
  process.env.STREAM_API_KEY,
  process.env.STREAM_APP_SECRET
);

const polly = new AWS.Polly({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-east-2',
});

app.post('/speech', async (req, res) => {
  const { text } = req.body;
  let params = {
    Text: text,
    OutputFormat: 'mp3',
    VoiceId: 'Matthew',
  };

//   polly.synthesizeSpeech(params, (err, data) => {
//     if (err) {
//       console.log(err);
//       res.status(500).end();
//     } else if (data) {
//       if (data.AudioStream instanceof Buffer) {
//         res.status(200).send(data);
//       }
//     }
//   });
AWS.config.region = 'us-east-2'; 
var polly1 = new AWS.Polly({apiVersion: '2016-06-10'});
var signer = new AWS.Polly.Presigner(params, polly)
signer.getSynthesizeSpeechUrl(params, function(error, url) {
    if (error) {
        console.log(error)
        res.status(500).send(error);
    } else {
        res.status(200).send(url)
    }
  });




});


const server = app.listen(process.env.PORT || 5500, () => {
  const { port } = server.address();
  console.log(`Server running on PORT ${port}`);
});