const SerialPort = require('serialport')
const ByteLength = require('@serialport/parser-byte-length')
var port = new SerialPort('COM3', {
    baudRate: 115200
});

const parser = port.pipe(new ByteLength({length: 2}))
parser.on('data', function (data) {
  console.log('Data:', parseInt(data.toString('hex'), 16));
});
