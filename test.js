const SerialPort = require('serialport')
SerialPort.list().then(
  ports => ports.forEach(elem => console.log(elem))
)
/*
var SerialPort = require('serialport');
var port = new SerialPort('COM3', {
    baudRate: 115200
});

// Switches the port into "flowing mode"
/*
port.on('data', function (data) {
    console.log('Data:', data);
});
*/

/*
const lineStream = port.pipe(new Readline())
console.log('lineStream:', lineStream);
*/
