
const rxjs = require('rxjs');
const serialport = require("serialport");
const Readline = require('@serialport/parser-readline');
const { resolve } = require('path');

class ArduinoSerialCommunication {
    
    spStatus = {
        openConnection: false,
        initialized: false,
        connectionEstabilished: false
    }
    
    constructor ( _ = {arduinoPort: com, arduinoBaudRate: baudRate}){
        this.sp = new serialport ( _.arduinoPort, {
            baudRate: _.arduinoBaudRate,
            autoOpen: false
        })
    }

    openConnection(){
        return new Promise( (resolve, reject) => {
            this.sp.open(err => {
                if (err) {
                    reject(err);
                }
                else
                    this.spStatus.openConnection = true;
                    resolve(true);
            })
        })

    }

    waitForConnection(){
        return new Promise( (resolve, reject) => {
            if (this.spStatus.openConnection !== true)
                reject("[Error: The connection is not open]");
            const parser = this.sp.pipe(new Readline({ delimiter: '\r\n' }));// Read the port data
            parser.on('data', data => {
                if (data === 'READY')
                    resolve(true);
                else {
                    reject("[Error: The key received from Arduino is not valid]");
                }
            })
        })
    }
    writeBuffer(data){
        this.sp.write(data);
    }

    writeFrame(seqId, dutyCicle, Frequency){
        const buf_seqID = Buffer.allocUnsafe(1);
        buf_seqID.writeUInt8(seqId);

        const buf_dutyCicle = Buffer.allocUnsafe(1);
        buf_dutyCicle.writeUInt8(dutyCicle);

        const buf_frequency = Buffer.allocUnsafe(2);
        buf_frequency.writeUInt16BE(Frequency);

        const arrayOfBuffers = [buf_seqID, buf_dutyCicle, buf_frequency];

        const buffer = Buffer.concat(arrayOfBuffers);

        this.sp.write(buffer);
    }

}



module.exports = { ArduinoSerialCommunication: ArduinoSerialCommunication }
