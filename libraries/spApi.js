const serialport = require("serialport");
const ByteLength = require('@serialport/parser-byte-length');


class SerialCommunication extends serialport {

    constructor(device = { port: port, baudRate: baudRate, frameLenght: frameLenght }) {
        super(device.port, {
            baudRate: device.baudRate,
            autoOpen: false
        });
        this._config = {
            frameLenght: device.frameLenght
        }
        this._status = {
            open: false,
            connectionEstabilished: false
        }
    }

    open() {
        return new Promise((resolve, reject) => {
            super.open(err => {
                if (err) {
                    reject(err);
                }
                else {
                    this._status.open = true;
                    resolve(true);
                }
            });
        });
    }

    waitForConnection(slaveKeyRxBuffer, masterKeyTxBuffer) {
        return new Promise((resolve, reject) => {
            //check if the connection is open
            if (this._status.open !== true) {
                reject("[Error: The connection is not open]");
            }
            else {
                //read from Slave
                const parser = super.pipe(new ByteLength({ length: this._config.frameLenght }));
                parser.on('data', data => {

                    if (Buffer.compare(slaveKeyRxBuffer, data) === 0) {
                        super.write(masterKeyTxBuffer, err => {
                            if (err)
                                reject(err);
                            else
                                resolve("[Success: write completed]");
                        });

                        this._status.connectionEstabilished = true;
                        resolve(true);
                    }
                    else {
                        reject("[Error: The key from arduino is not correct]");
                    }
                });
            }
        });
    }

    writeFrame(masterBuffer) {
        return new Promise((resolve, reject) => {
            //check if the connection is open
            if (this._status.connectionEstabilished !== true){
                reject("[Error: The connection is not estabilished]");
            }
            else{
                super.write(masterBuffer, err => {
                    if (err)
                        reject(err);
                    else
                        resolve("[Success: write completed]");
                });
            }
        });
    }

    on(eventData, fnCallback) {
        if (eventData === 'frame'){
            const parser = super.pipe(new ByteLength({ length: this._config.frameLenght }));
            parser.on('data', data => {
                if (this._status.connectionEstabilished === true) {
                    fnCallback(data, "Frame Received:");
                }
                else{
                    fnCallback(data, "Key Frame Received:");
                }
            });
        }
        else{
            super.on(eventData, data => {
                fnCallback(data, "Data:");
            });
        }
    }
}

module.exports = { SerialCommunication: SerialCommunication };
