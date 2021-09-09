const net = require('net');

// Define host & port
const port = 8080;
const host = '127.0.0.1';

// Instance
const server = net.createServer(onClientConnection);

//Start listening with the server on given port and host.
server.listen(port, host, function () {
    console.log(`Server started on ${host}:${port}`);
});

//Declare connection listener function
function onClientConnection(sock) {
    //Log when a client connects.
    console.log(`${sock.remoteAddress}:${sock.remotePort} Connected`);

    //Listen for data from the connected client.
    sock.on('data', function (data) {
        //Log data from client
        const response = data.toString().split('\n');

        // Output Data
        const clientResponse = response.map(function(name) {
            return mathCalc(name);
        }).join('\n');

        sock.write(clientResponse);

        // Destroy socket
        process.nextTick(function () {
            sock.destroy()
        });
    });

    //Handle client connection termination.
    sock.on('close', function () {
        console.log(`${sock.remoteAddress}:${sock.remotePort} Terminated connection`);
    });

    //Handle Client connection error.
    sock.on('error', function (error) {
        console.error(`${sock.remoteAddress}:${sock.remotePort} Connection error : ${error}`);
    });
}

function mathCalc(expression) {
    if (isValidMathExpression(expression)) {
        let result;
        let numOr0 = n => isNaN(n) ? 0 : Number(n);

        if (/\*/.test(expression)) {
            const numbersString = expression.split('*');
            result = numbersString.reduce((accumulator, current) => numOr0(accumulator) * numOr0(current));
        }

        if (/\-/.test(expression)) {
            const numbersString = expression.split('-');
            result = numbersString.reduce((accumulator, current) => numOr0(accumulator) - numOr0(current));
        }

        if (/\+/.test(expression)) {
            const numbersString = expression.split('+');
            result = numbersString.reduce((accumulator, b) => numOr0(accumulator) + numOr0(b));
            result = Math.floor(result);
        }

        if (/\//.test(expression)) {
            const numbersString = expression.split('/');
            numbersString.reduce(function (accumulator, current) {
                if (numOr0(accumulator) === 0 || numOr0(current) === 0) {
                    result = 'error: division by zero';
                } else {
                    result = Math.floor(numOr0(accumulator) / numOr0(current));
                }
            });
        }

        if (/\%/.test(expression)) {
            const numbersString = expression.split('%');
            result = numbersString.reduce((accumulator, current) => numOr0(accumulator) % numOr0(current));
        }
        return Number.isInteger(result) ? ToUInt32(result) : result;
    } else {
        return 'error: incorrect syntax';
    }
}

function isValidMathExpression(exp) {
    if (exp !== '') {
        try {
            // or /[\%\-\/\+\*]/.test(exp)
            const result = eval(exp);
            return true;
        } catch (e) {
            return false;
        }
    } else {
        return false;
    }
}

// Convert to Unsigned 32 byte
function ToUInt32(value) {
    return modulo(toInteger(value), Math.pow(2, 32));
}

// Finds the remainder after division of one number by another
function modulo(a, b) {
    return a - Math.floor(a / b) * b;
}

// Convert value to INT
function toInteger(value) {
    value = Number(value);
    return value < 0 ? Math.ceil(value) : Math.floor(value);
}
