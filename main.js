/*==================================================================================================
  Requires
==================================================================================================*/
const spApi = require('./libraries/spApi');
const frameApi = require('./libraries/frameApi');

/*==================================================================================================
  Global variables
==================================================================================================*/
const masterFrame = new frameApi.FrameMaster();
const slaveFrame = new frameApi.FrameSlave();

masterFrame.packet =
{
  seqId: 0,
  masterCommands: 17,
  pwmFrequency: 500,
  pwmDutyCicle: 127,
  auxOutput: 5
}

const serialCommunication = new spApi.SerialCommunication({
  port: 'COM3',
  baudRate: 115200,
  frameLenght: 6
});

/*==================================================================================================
  Events
==================================================================================================*/
serialCommunication.on('frame', (buffer, description) => {
  slaveFrame.assignFromBuffer(buffer);

  const time = new Date();
  const arr_time = [time.getMinutes(), time.getSeconds(), time.getMilliseconds()];

  console.log("\n---");
  console.log(`${arr_time[0]}.${arr_time[1]}.${arr_time[2]}`);
  console.log(`seqId: ${masterFrame.packet.seqId}`);
  console.log(`mCommands: ${masterFrame.packet.masterCommands}`);
  console.log(`pwmF: ${masterFrame.packet.pwmFrequency}`);
  console.log(`pwmDC: ${masterFrame.packet.pwmDutyCicle}`);
  console.log(`O: ${masterFrame.packet.auxOutput}`);
  console.log(`seqId: ${slaveFrame.packet.seqId}`);
  console.log(`sStatus: ${slaveFrame.packet.slaveStatus}`);
  console.log(`f_ms: ${slaveFrame.packet.pumpFeedback_ms}`);
  console.log(`I: ${slaveFrame.packet.auxInput}`);
  console.log(`sErr: ${slaveFrame.packet.auxSlaveError}`);
  console.log("---\n");
  write();
});

/*==================================================================================================
  Functions
==================================================================================================*/
function wait(time) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
}

let counter = 0;
let first = true;
let commandArr = [1,16];
let index = 0;

let write = async () => {
  counter++;
  if (counter >= 20){
    masterFrame.setMasterCommands(commandArr[index++]);
    index = (index == 2)? 0: index;
    counter = 0;
  }
  else{
    if (slaveFrame.packet.slaveStatus != 0) {
      masterFrame.setMasterCommands(0);
    }
  }
  masterFrame.setSeqId(slaveFrame.getSeqId() + 1);
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

   console.log('attendi 1 sec..');
   await wait(1000);

  try {
    console.log("Invio un frame generico ad Arduino..");
    write();
    console.log("Frame trasmesso con successo!");
  } catch (error) {
    console.log(error);
  }

};

main();
