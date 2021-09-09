const net = require('net');

const client = new net.Socket();
client.connect(8080, '127.0.0.1', function() {
    console.log('Connected');

    client.write('1+2\n3');
    client.write('+3\n2+4\n5/0\n');
    client.write('5/2\n');
    client.write('101/10\n');
    client.write('0-1\n');
    client.write('0!1\n');
    client.write('5%2\n');
    client.write('4294967295 + 1\n');
    client.write('hello world\n');

});

client.on('data', function(data) {
    console.log(data.toString());
});

client.on('error', function(data) {
    console.log(data.toString());
});

client.on('close', function() {
    console.log('Connection closed');
});