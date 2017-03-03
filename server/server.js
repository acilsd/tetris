/*eslint no-console: "off"*/
const GameServer = require('ws').Server;
const Session = require('./session');
const Client = require('./client');

const server = new GameServer({ port: 8008 });
const sessions = new Map;

const createId = (len = 6, chars = 'abcdefghjkmnopqrstwxyz0123456789') => {
  let id = '';
  while (len--) {
    id += chars[Math.random() * chars.length | 0];
  }
  return id;
};

const createClient = (connection, id = createId()) => {
  return new Client(connection, id);
};

const createSession = (id = createId()) => {
  if (sessions.has(id)) {
    throw new Error(`Session ${id} already exists`);
  }

  const session = new Session(id);
  sessions.set(id, session);
  return session;
};

const getSession = (id) => {
  return sessions.get(id);
};

const broadcastSession = (session) => {
  const clients = [...session.clients];
  clients.forEach(client => {
    client.send({
      type: 'session-broadcast',
      peers: {
        you: client.id,
        clients: clients.map(client => {
          return {
            id: client.id,
            state: client.state,
          };
        })
      },
    });
  });
};

server.on('connection', connect => {
  console.info('connected!');
  const client = createClient(connect);

  connect.on('message', msg => {
    const data = JSON.parse(msg);

    if (data.type === 'create-session') {
      const session = createSession();
      session.join(client);
      client.state = data.state;
      client.send({
        type: 'session-created',
        id: session.id,
      });
    } else if (data.type === 'join-session') {
      const session = getSession(data.id) || createSession(data.id);
      session.join(client);
      client.state = data.state;
      broadcastSession(session);
    } else if (data.type === 'state-update') {
      const [key, value] = data.state;
      client.state[data.fragment][key] = value;
      client.broadcast(data);
    }
  });

  connect.on('close', () => {
    console.info('disconnected!');
    const session = client.session;
    if (session) {
      session.leave(client);
      if (session.clients.size === 0) {
        sessions.delete(session.id);
      }
    }
    broadcastSession(session);
  });
});

// const express = require('express');
// const app = express();
// const port = 3009;
// app.listen(port, () => {
//   console.info(`Server listening on port: ${port}`);
// });
