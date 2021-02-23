const spApi = require('./spApi');
const ByteLength = require('@serialport/parser-byte-length')

const masterFrame = {
  //Section1
  seqId: 0,
  //Section2
  masterCommands: 0,
  pwmFrequency: 0,
  pwmDutyCicle: 0,
  auxOutput: 0,
  //Section3
  slaveFeedbackStatus: 0,
  pumpFeedback_ms: 0,
  auxInputFeedback: 0,
  auxSlaveError: 0
}

const keyFrame = {
  //Section1
  seqId: 0,
  //Section2
  masterCommands: 0,
  pwmFrequency: 0,
  pwmDutyCicle: 0,
  auxOutput: 0,
  //Section3
  slaveFeedbackStatus: 56,
  pumpFeedback_ms: 0,
  auxInputFeedback: 0,
  auxSlaveError: 0
}

  

let serialCommunication = new spApi.ArduinoSerialCommunication({
  arduinoPort: 'COM5',
  arduinoBaudRate: 115200
});

serialCommunication.on('data', data => {
  if (serialCommunication.spStatus.connectionEstabilished === true) {
    console.log((data));
    //return func(data);
  }

});


function wait(time){
  return new Promise((resolve,reject) => {
    setTimeout(() => {
      resolve()
    }, time);
  })
}

let main = async function(){

  console.log('start');
  console.log('attendi 1 sec..');
  await wait(1000);

  console.log('Apro una connessione con Arduino...');

  //Apro una connessione verso Arduino
  //Questa operazione manderà in reset la board
  try {
    await serialCommunication.openConnection();
  } catch (error) {
    console.log(error);
  }

  //Aspetto di stabilire una connessione con Arduino
  //Il metodo consigliato è quello di far trasmettere da Arduino una sequenza di caratteri che identifica
  //lo stato "READY" della periferica
  //waitForConnection accetta come parametro la stringa da riconoscere
  try {
    await serialCommunication.waitForConnection(keyFrame);
    console.log('Connessione con Arduino stabilita');
  } catch (error) {
    console.log(error);
  }

  masterFrame.seqId = 0;
  masterFrame.dutyCicle = 150;
  masterFrame.Frequency = 456;

  serialCommunication.writeFrame(
    masterFrame.seqId,
    masterFrame.dutyCicle,
    masterFrame.Frequency
  );

}


main();

