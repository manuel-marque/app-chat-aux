#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require('../app');
var debug = require('debug')('06-chat:server');
var http = require('http');

const {MENSAJE_CHAT, USUARIOS_CHAT, CONNECTION, DISCONNECT} = require('../events');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

// Configuracion Socket.io

const io = require('socket.io')(server);

io.on(CONNECTION, (socket) => {
  console.log('se ha conectado un nuevo cliente');

  //emitir un mensaje a todos los clientes conectados desde el servidor, avisando que se ha conectado uno nuevo
  socket.broadcast.emit(MENSAJE_CHAT, {
    nombre: 'INFO', 
    mensaje: 'Se conectado un nuevo usuario',
    tipo: 'admin'
  });

  //emitir el numero de clientes conectados

  io.emit(USUARIOS_CHAT, io.engine.clientsCount);

  // Suscribirnos al evento mensaje_chat
  socket.on(MENSAJE_CHAT, (data) => {
    io.emit(MENSAJE_CHAT, data);
  });

  socket.on(DISCONNECT, () => {
    //Mensaje para todos los clientes conectados avisando de la desconexion
    io.emit(MENSAJE_CHAT, {
      nombre: 'INFO',
      mensaje: 'Un usuario ha abandonado la sala',
      tipo: 'admin'
    });
    //emitir el numero de clientes conectados
    io.emit(USUARIOS_CHAT, io.engine.clientsCount);
  });

});

// Fin Configuracion Socket.io

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
