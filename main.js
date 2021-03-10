const spApi = require('./libraries/spApi');
const frameApi = require('./libraries/frameApi');

const masterFrame = new frameApi.Frame();
masterFrame.packet =
{
  seqId: 0,
  masterCommands: 10,
  pwmFrequency: 500,
  pwmDutyCicle: 127,
  auxOutput: 5,
  slaveStatus: 0,
  pumpFeedback_ms: 0,
  auxInput: 0,
  auxSlaveError: 0,
}

const slaveFrame = new frameApi.Frame();

let serialCommunication = new spApi.SerialCommunication({
  port: 'COM3',
  baudRate: 115200,
  frameLenght: 11
});

serialCommunication.on('frame', (buffer, description) => {
  slaveFrame.assignFromBuffer(buffer);
  masterFrame.assignFromBuffer(buffer);

  /*
  console.log("\n--------------------------");
  console.log(description);
  console.log(slaveFrame.packet);
  console.log("--------------------------\n");
  */

  console.clear();
  console.log("\n---");
  console.log(slaveFrame.packet.seqId);
  console.log(slaveFrame.packet.masterCommands);
  console.log(slaveFrame.packet.pwmFrequency);
  console.log(slaveFrame.packet.pwmDutyCicle);
  console.log(slaveFrame.packet.slaveStatus);
  console.log(slaveFrame.packet.pumpFeedback_ms);
  console.log(slaveFrame.packet.auxOutput);
  console.log(slaveFrame.packet.auxInput);
  console.log(slaveFrame.packet.auxSlaveError);
  console.log("---\n");
  write();
});

function wait(time) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
}

let command = true;

let write = async () => {
  if(command){
    masterFrame.setMasterCommands(10);
    command = false;
  }
  else{
    masterFrame.setMasterCommands(20);
    command = true;
  }
  let seqId = masterFrame.getSeqId();
  masterFrame.setSeqId(++seqId);
  await serialCommunication.writeFrame(masterFrame.convertToBuffer());
}

let main = async () => {

  console.log('start');
  console.log('attendi 1 sec..');
  await wait(1000);

  console.log('Apro una connessione con Arduino...');
  console.log('Arduino si riavvia...');
  try {
    await serialCommunication.open();
  } catch (error) {
    console.log(error);
  }

  console.log('attendi 5 sec..');
  await wait(5000);

  try {
    console.log("Invio un frame generico ad Arduino..");
    write();
    console.log("Frame trasmesso con successo!");
  } catch (error) {
    console.log(error);
  }

};

main();
