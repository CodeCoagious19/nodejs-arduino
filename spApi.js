
const rxjs = require('rxjs');
const serialport = require("serialport");
const Readline = require('@serialport/parser-readline');
const ByteLength = require('@serialport/parser-byte-length')
const Ready = require('@serialport/parser-ready')
const { resolve } = require('path');

/*
const parser = port.pipe(new Ready({ delimiter: 'READY' }))
parser.on('ready', () => console.log('the ready byte sequence has been received'))
*/

class ArduinoSerialCommunication extends serialport {

    _spStatus = {
        openConnection: false,
        connectionEstabilished: false
    }


    constructor(_ = { arduinoPort: com, arduinoBaudRate: baudRate }) {
        super(_.arduinoPort, {
            baudRate: _.arduinoBaudRate,
            autoOpen: false
        })
    }

    get spStatus(){
        return this._spStatus;
    }

    openConnection() {
        return new Promise((resolve, reject) => {
            super.open(err => {
                if (err) {
                    reject(err);
                }
                else
                    this._spStatus.openConnection = true;
                resolve(true);
            })
        })
    }

    waitForConnection(keyFrameObj)
    {
        return new Promise((resolve, reject) => {
            //check if the connection is open
            if (this._spStatus.openConnection !== true)
                reject("[Error: The connection is not open]");

            let receivedFrameArray = [];
            let keyFrameArray = [];

            //convert keyFrameObj into keyFrameArray
            for(let prop in keyFrameObj){
                keyFrameArray.push(keyFrameObj[prop]);
            }

            //read from Arduino
            const parser = super.pipe(new ByteLength({length: keyFrameArray.length}))
            parser.on('data', data => {

                //read Received byte and write into receivedFrameArray
                for(let i = 0; i<parser.length; i++){
                    receivedFrameArray[i] = data.readUInt8(i).toString();
                }

                //compare receivedFrameArray with keyFrameArray
                //must be equals
                let equals = true;
                for(let i = 0; i<parser.length; i++){
                    equals &= (receivedFrameArray[i] == keyFrameArray[i]); 
                }
                if (equals){
                    this._spStatus.connectionEstabilished = true;
                    resolve(true);
                }
                else{
                    reject("[Error: The key from arduino is not correct]");
                }
            })
        })
    }

    writeFrame(seqId, dutyCicle, Frequency) {
        const buf_seqID = Buffer.allocUnsafe(1);
        buf_seqID.writeUInt8(seqId);

        const buf_dutyCicle = Buffer.allocUnsafe(1);
        buf_dutyCicle.writeUInt8(dutyCicle);

        const buf_frequency = Buffer.allocUnsafe(2);
        buf_frequency.writeUInt16BE(Frequency);

        const arrayOfBuffers = [buf_seqID, buf_dutyCicle, buf_frequency];

        const buffer = Buffer.concat(arrayOfBuffers);

        super.write(buffer);
    }

    /*
    onFrameReceived(func) {
        /*
        const parser = super.pipe(new Readline({ delimiter: '\r\n' }));// Read the port data
        parser.on('data', buffer => {
            if(this.spStatus.connectionEstabilished === true)
                return func(buffer);
        });
        

        const parser = super.pipe(new ByteLength({ length: 2 }));
        parser.on('data', data => {
            return (func(data.toString('hex'), 16));
            //return func(data);
        });
    }
    */
}





module.exports = { ArduinoSerialCommunication: ArduinoSerialCommunication }
