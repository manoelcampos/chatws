const socketIO = require('socket.io')
const express = require('express')
const app = express()
const httpServer = require('http').createServer(app)

//Cria um servidor de websocket que usa a mesma porta do servidor HTTP
const serverSocket = socketIO(httpServer)
app.use(express.static('public'))

serverSocket.on('connect', socket => {
    console.log(`Cliente ${socket.id} conectado`);
    socket.on('chat msg', msg => {
        if(socket.login)
            msg = `${socket.login}: ${msg}`;
        else {
            socket.login = msg;
            msg = `Usuário ${socket.login} entrou`;
        }
        console.log(msg);
        serverSocket.emit('chat msg', msg);
    });

    socket.on('status', msg => {
        console.log(msg);
        //serverSocket.emit('status', msg) // o servidor envia msg em broadcast (para todos os clientes)

        //o cliente que enviou msg pro servidor encaminha tal msg em broadcast pros outros clientes
        socket.broadcast.emit('status', msg) 
    });
})

const PORT = 8080
httpServer.listen(PORT, () => console.log('Servidor iniciado na porta ' + PORT))

/*
SaaS = Software as a Service = Software como Serviço
PaaS = Platform as a Service = Plataforma como Serviço
IaaS = Infrastructure as a Service = Infraestrutura como Serviço
 */

