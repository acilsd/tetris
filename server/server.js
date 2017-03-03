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

server.on('connection', connect => {
  console.info('connected!');
  const client = new Client(connect);
  connect.on('message', msg => {
    if (msg === 'create-session') {
      const id = createId();
      const session = new Session(id);
      session.join(client);
      sessions.set(session.id, session);
      console.log(sessions);
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
  });

});
