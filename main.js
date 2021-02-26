const spApi = require('./spApi');
const ByteLength = require('@serialport/parser-byte-length');

const masterFrameObj = {
  /*Section1*/
  seqId: 1,
  /*Section2*/
  masterCommands: 2,
  pwmFrequency: 3,
  pwmDutyCicle: 4,
  auxOutput: 5,
  /*Section3*/
  slaveFeedbackStatus: 6,
  pumpFeedback_ms: 7,
  auxInputFeedback: 8,
  auxSlaveError: 9,
};

const slaveKeyFrameRxObj = {
  /*Section1*/
  seqId: 0,
  /*Section2*/
  masterCommands: 0,
  pwmFrequency: 0,
  pwmDutyCicle: 0,
  auxOutput: 0,
  /*Section3*/
  slaveFeedbackStatus: 255,
  pumpFeedback_ms: 0,
  auxInputFeedback: 0,
  auxSlaveError: 0,
};

const masterKeyFrameTxObj = {
  /*Section1*/
  seqId: 1,
  /*Section2*/
  masterCommands: 0,
  pwmFrequency: 0,
  pwmDutyCicle: 0,
  auxOutput: 0,
  /*Section3*/
  slaveFeedbackStatus: 255,
  pumpFeedback_ms: 0,
  auxInputFeedback: 0,
  auxSlaveError: 0,
};

let serialCommunication = new spApi.ArduinoSerialCommunication({
  arduinoPort: 'COM5',
  arduinoBaudRate: 115200,
});

serialCommunication.onFrameReceived2('data', (values, log) => {
  console.log("\n--------------------------");
  console.log(log);
  console.log(values);
  console.log("--------------------------\n");
});

function wait(time) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
}

let main = async () => {

  console.log('start');
  console.log('attendi 1 sec..');
  await wait(1000);

  //Apro una connessione verso Arduino
  //Questa operazione eseguirà il reset fisico della board
  console.log('Apro una connessione con Arduino...');
  console.log('Arduino si riavvia...');
  try {
    await serialCommunication.openConnection();
  } catch (error) {
    console.log(error);
  }

  //Tento di aprire una connessione con Arduino
  //La waitForConnection() attende di ricevere una chiave da Arduino, l'oggetto slaveKeyFrameRx
  //e restituisce ad esso una chiave masterKeyFrameTx
  try {
    console.log('Attendo il key frame da Arduino..');
    await serialCommunication.waitForConnection(slaveKeyFrameRxObj, masterKeyFrameTxObj);
    console.log("Il key frame ricevuto da Arduino è corretto.");
    console.log("Invio il key frame per l'autenticazione da parte di Aduino..");
    console.log("Connessione con Arduino stabilita con Successo!");
  } catch (error) {
    console.log(error);
  }
  try {
    console.log("Invio un frame generico ad Arduino..");
    await serialCommunication.writeFrame(masterFrameObj);
    console.log("Frame trasmesso con successo!");
  } catch (error) {
    console.log(error);
  }

};

main();
