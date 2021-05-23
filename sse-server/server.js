const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/status', (request, response) => response.json({ sessions: sessions.length }));

const PORT = 3001;

let sessions = [];
let users = [];


function eventsHandler(request, response, next) {
  const headers = {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache'
  };
  response.writeHead(200, headers);

  const data = `data: ${JSON.stringify(users)}\n\n`;

  response.write(data);

  const sessionId = Date.now();

  const newSession = {
    id: sessionId,
    response
  };

  sessions.push(newSession);

  request.on('close', () => {
    console.log(`${sessionId} Connection closed`);
    sessions = sessions.filter(session => session.id !== sessionId);
  });
}

app.get('/events', eventsHandler);

function sendEventsToAll(newUser) {
  sessions.forEach(session => session.response.write(`data: ${JSON.stringify(newUser)}\n\n`))
}

async function addUser(request, respsonse, next) {
  const newUser = request.body;
  users.push(newUser);
  respsonse.json(newUser)
  return sendEventsToAll(newUser);
}

app.post('/users', addUser);

app.get('/data', (req, res) => {
  res.send({activeSessions:sessions.length, registeredUsers:users.length})
})

app.listen(PORT, () => {
  console.log(`SSE / Events service listening at http://localhost:${PORT}`)
})


module.exports = {
  sessions,
  users,
  sendEventsToAll
}