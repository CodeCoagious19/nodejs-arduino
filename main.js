const spApi = require('./libraries/spApi');
const frameApi = require('./libraries/frameApi');

//Key frame from Slave
const slaveKeyFrameRx = new frameApi.Frame();
slaveKeyFrameRx.packet =
{
  slaveFeedbackStatus: 255
}
//Key frame to Slave
const masterKeyFrameTx = new frameApi.Frame();
masterKeyFrameTx.packet =
{
  seqId: 1,
  slaveFeedbackStatus: 255
}
const masterFrame = new frameApi.Frame();
masterFrame.packet =
{
  seqId: 1,
  masterCommands: 2,
  pwmFrequency: 3,
  pwmDutyCicle: 4,
  auxOutput: 5,
  slaveFeedbackStatus: 6,
  pumpFeedback_ms: 7,
  auxInputFeedback: 8,
  auxSlaveError: 9,
}

let serialCommunication = new spApi.SerialCommunication({
  port: 'COM5',
  baudRate: 115200,
  frameLenght: 9
});

serialCommunication.on('frame', (buffer, description) => {
  frameReceived = new frameApi.Frame();
  frameReceived.assignFromBuffer(buffer);
  console.log("\n--------------------------");
  console.log(description);
  console.log(frameReceived.packet);
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
    await serialCommunication.open();
  } catch (error) {
    console.log(error);
  }

  //Tento di stabilire una connessione con Arduino
  try {
    console.log('Attendo il key frame da Arduino..');
    await serialCommunication.waitForConnection(slaveKeyFrameRx.convertToBuffer(), masterKeyFrameTx.convertToBuffer());
    console.log("Il key frame ricevuto da Arduino è corretto.");
    console.log("Invio il key frame per l'autenticazione da parte di Aduino..");
    console.log("Connessione con Arduino stabilita con Successo!");
  } catch (error) {
    console.log(error);
  }
  try {
    console.log("Invio un frame generico ad Arduino..");
    await serialCommunication.writeFrame(masterFrame.convertToBuffer());
    console.log("Frame trasmesso con successo!");
  } catch (error) {
    console.log(error);
  }

};

main();
