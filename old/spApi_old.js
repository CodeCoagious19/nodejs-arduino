const rxjs = require('rxjs');
const serialport = require("serialport");

const sp = new serialport('COM3', {
    baudRate: 115200,
});

//#region public api (EXPORTS)
let connectionEstabilished = new rxjs.BehaviorSubject(null);

function write(data) {
    if (connectionEstabilished.getValue() == true) {
        sp.write(data);
    } else {
        console.error('connection error');
    }
}
//#endregion

//#region private methods
sp.on('open', () => {
    sp.on('data', buffer => {
        const byteFromArduino = parseInt(buffer.toString('hex'), 16);
        if (byteFromArduino === 233) {
            if (!connectionEstabilished.getValue()) {
                connectionEstabilished.next(true);
            }
        }
        else {
            connectionEstabilished.next(false);
        }
    });
})
//#endregion


module.exports = { connectionEstabilished: connectionEstabilished, write: write }
