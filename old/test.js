const spApi = require('./spApi');
const led_on_command = Buffer.from([65]);
const led_off_command = Buffer.from([66]);
let ledState = false;

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


let serialCommunication = new spApi.ArduinoSerialCommunication({
  arduinoPort: 'COM5',
  arduinoBaudRate: 115200
});

function wait(time){
  return new Promise((resolve,reject) => {
    setTimeout(() => {
      resolve()
    }, time);
  })
}

function toggleLed() {
  if (ledState) {
    serialCommunication.writeBuffer(led_on_command)
  } else {
    serialCommunication.writeBuffer(led_off_command)
  }
  ledState = !ledState;
}



let main = async function(){

  console.log('start');
  console.log('attendi 1 sec..');
  await wait(1000);

  console.log('Apro una connessione con Arduino...');


  try {
    await serialCommunication.openConnection();
  } catch (error) {
    console.log(error);
  }
  
  try {
    await serialCommunication.waitForConnection();
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

  console.log('end');
}


main();

