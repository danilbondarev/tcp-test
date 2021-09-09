const net = require('net');

const client = new net.Socket();
client.connect(8080, '127.0.0.1', function() {
    console.log('Connected');

    //client.write('1+2\n3');
    //client.write('+3\n2+4\n5/0\n');
    client.write('5/2\n' +
        '101/10\n' +
        '0-1\n' +
        '0!1\n' +
        '5%2\n' +
        '10%0\n' +
        '0.7+0.2\n' +
        '12/3\n' +
        '4294967295 + 1\n' +
        'hello world\n');

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