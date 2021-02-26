
const rxjs = require('rxjs');
const serialport = require("serialport");
const Readline = require('@serialport/parser-readline');
const ByteLength = require('@serialport/parser-byte-length');
const Ready = require('@serialport/parser-ready');
const { resolve } = require('path');

/*
const parser = port.pipe(new Ready({ delimiter: 'READY' }))
parser.on('ready', () => console.log('the ready byte sequence has been received'))
*/

class ArduinoSerialCommunication extends serialport {

    constructor(_ = { arduinoPort: com, arduinoBaudRate: baudRate }) {
        super(_.arduinoPort, {
            baudRate: _.arduinoBaudRate,
            autoOpen: false
        });
        this._openConnection = false;
        this._connectionEstabilished = false;
        this._frameByteLength = 9;
    }

    openConnection() {
        return new Promise((resolve, reject) => {
            super.open(err => {
                if (err) {
                    reject(err);
                }
                else
                    this._openConnection = true;
                resolve(true);
            });
        });
    }

    waitForConnection(slaveKeyFrameRxObj, masterKeyFrameTxObj)
    {
        return new Promise((resolve, reject) => {
            //check if the connection is open
            if (this._openConnection !== true)
                reject("[Error: The connection is not open]");

            let receivedFrameArray = [];

            // TODO: realizza una funzione che:
            // - trasfroma un oggetto in un buffer per la trasmissione
            // - trasfroma un buffer in un oggetto per la ricezione
            // - una funzione che confronta due oggetti
            let slaveKeyFrameRxArray = [];
            let masterKeyFrameTxArray = [];

            //convert slaveKeyFrameRxObj into slaveKeyFrameRxArray
            for(let prop in slaveKeyFrameRxObj){
                slaveKeyFrameRxArray.push(slaveKeyFrameRxObj[prop]);
            }

            //convert masterKeyFrameTxObj into masterKeyFrameTxArray
            for(let prop in masterKeyFrameTxObj){
                masterKeyFrameTxArray.push(masterKeyFrameTxObj[prop]);
            }

            //read from Arduino
            const parser = super.pipe(new ByteLength({length: this._frameByteLength}));
            parser.on('data', data => {

                //read Received byte and write into receivedFrameArray
                for(let i = 0; i<parser.length; i++){
                    receivedFrameArray[i] = data.readUInt8(i);
                }

                //compare receivedFrameArray with slaveKeyFrameRxArray
                //must be equals
                let equals = true;
                for(let i = 0; i<parser.length; i++){
                    equals &= (receivedFrameArray[i] == slaveKeyFrameRxArray[i]);
                }
                if (equals){
                    //convert masterFrameArray into masterFrameBuffer
                    const masterKeyFrameTxBuffer = Buffer.from(masterKeyFrameTxArray);

                    super.write(masterKeyFrameTxBuffer, err => {
                        if (err)
                            reject(err);
                        else
                            resolve("[Success: write completed]");
                    });

                    this._connectionEstabilished = true;
                    resolve(true);
                }
                else{
                    reject("[Error: The key from arduino is not correct]");
                }
            });
        });
    }

    writeFrame(masterFrameObj) {
        return new Promise((resolve, reject) => {
            //check if the connection is open
            if (this._connectionEstabilished !== true)
                reject("[Error: The connection is not estabilished]");

            let masterFrameArray = [];

            //convert masterFrameObj into masterFrameArray
            for(let prop in masterFrameObj){
                masterFrameArray.push(masterFrameObj[prop]);
            }

            //convert masterFrameArray into masterFrameBuffer
            const masterFrameBuffer = Buffer.from(masterFrameArray);

            super.write(masterFrameBuffer, err => {
                if (err)
                    reject(err);
                else
                    resolve("[Seccess: write completed]");
            });
        });
    }

    /*
    onFrameReceived() {
      const parser = super.pipe(new ByteLength({length: this._frameByteLength}));
      parser.on('data', data => {
        if (this._connectionEstabilished === true){
          let receivedFrameArray = [];
          for(let i = 0; i<parser.length; i++){
              receivedFrameArray[i] = data.readUInt8(i);
          }
          console.log(receivedFrameArray);
        }
        else{
          let receivedFrameArray = [];
          for(let i = 0; i<parser.length; i++){
              receivedFrameArray[i] = data.readUInt8(i);
          }
          console.log("Key frame from Arduino..");
          console.log(receivedFrameArray);
        }
      });
    }
    */

    onFrameReceived2(eventData, fnCallback) {
      const parser = super.pipe(new ByteLength({length: this._frameByteLength}));
      parser.on(eventData, data => {
        if (this._connectionEstabilished === true){
          let receivedFrameArray = [];
          for(let i = 0; i<parser.length; i++){
              receivedFrameArray[i] = data.readUInt8(i);
          }
          fnCallback(receivedFrameArray, "Frame generico ricevuto da Arduino:");
        }
        else{
          let receivedFrameArray = [];
          for(let i = 0; i<parser.length; i++){
              receivedFrameArray[i] = data.readUInt8(i);
          }
          fnCallback(receivedFrameArray, "Key Frame ricevuto da Arduino:");
        }
      });
    }
    /*

foo("address", function(location){
  alert(location); // this is where you get the return value
});
*/

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

module.exports = { ArduinoSerialCommunication: ArduinoSerialCommunication };
