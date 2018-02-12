const net = require('net');
const server = net.createServer();
let counter = 0;
let sockets = {};

server.on('connection', socket => {
    socket.id = counter++;
    console.log('client connected');
    socket.write("Please enter your name: ");

    socket.on('data', data => {
        if (!sockets[socket.id]) {
            socket.name = data.toString().trim();
            socket.write(`Welcome ${socket.name}\n`);
            sockets[socket.id] = socket;
        }
        Object.entries(sockets).forEach(([key, cs]) => {
            if (socket.id == key)
                return;
            cs.write(`${socket.name}: ${new Date().getHours()}:${new Date().getMinutes()}\n`);
            cs.write(`  ${data}`)
        });
    });
    socket.on('end', () => {
        console.log(`${socket.name} disconneted`)
        delete sockets[socket.id];
    })
});
server.listen(process.env.PORT, () => {
    console.log(`server started at: ${process.env.PORT}`);
})