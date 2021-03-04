
//Arduino === slave
//Node.js === master
//SC = Serial communication module
//E = error
//STATUS = stato, riferito alla macchina a stati

#define FRAME_LENGHT_BYTE 11

struct Sc_FrameType
{
  uint8_t seqID;
  uint8_t masterCommands;
  uint16_t pwmFrequency;
  uint8_t pwmDutyCicle;
  uint8_t auxOutput;
  uint8_t slaveFeedbackStatus;
  uint16_t pumpFeedbackStatus;
  uint8_t auxInputFeedback;
  uint8_t auxSlaveError;
};

Sc_FrameType slaveKeyFrame = {
  .seqID = 0,
  .masterCommands = 0,
  .pwmFrequency = 677,
  .pwmDutyCicle = 0,
  .auxOutput = 0,
  .slaveFeedbackStatus = 255,
  .pumpFeedbackStatus = 12900,
  .auxInputFeedback = 0,
  .auxSlaveError = 0
};

Sc_FrameType masterKeyFrame = {
  .seqID = 1,
  .masterCommands = 0,
  .pwmFrequency = 677,
  .pwmDutyCicle = 0,
  .auxOutput = 0,
  .slaveFeedbackStatus = 255,
  .pumpFeedbackStatus = 12900,
  .auxInputFeedback = 0,
  .auxSlaveError = 0
};



/* ************************************ ************************************ */

/* api */

/* ************************************ ************************************ */

/* ************************************ ************************************ */
/* Macchina a stati */
typedef enum {
  SC_STATUS_UNINITIALIZED = 0,
  SC_STATUS_INITIALIZED = 1,
  SC_STATUS_CONNECTED = 2,
  SC_STATUS_RECEIVING = 3,
  SC_STATUS_TRANSMITTING = 4,
}Sc_StatusType;
Sc_StatusType Sc_Status = SC_STATUS_UNINITIALIZED;

typedef enum {
  SC_E_NO_ERROR = 0,
  SC_E_WRONG_KEY_FRAME_FROM_MASTER = 1
}Sc_ErrorType;
Sc_ErrorType Sc_Error = SC_E_NO_ERROR;
/* ************************************ ************************************ */

/* ************************************ ************************************ */
void Sc_Init(uint32_t baudRate){
  Serial.begin(baudRate);
  while (!Serial) {
    ; // wait for serial port to connect. Needed for native USB
  }
  Sc_Status = SC_STATUS_INITIALIZED;
}

//Questa API dovrà inviare la key frame al master e attendere che
//il master risponda con la sua key frame
//Ritornerà un boolean true se la connessione è stabilit, false altrimenti
//Dovrà essere un'operazione "non bloccante" nel senso che dovrà leggere il dato solo quando arriva
//e non aspettare di leggere un dato

/*
Sc_ErrorType Sc_WaitForConnection(slaveKeyFrameTx, masterKeyFrameRx, &isConnectionEstabilished){

  //1 - converti la struct slaveKeyFrameTx in un array di uint8_t, slaveKeyFrameTxArray
  //  - converti la struct masterKeyFrameRx in un array di uint8_t, masterKeyFrameRxArray
  //2 - invia slaveKeyFrameTxArray attraverso Serial.write()
  //3 - if(Serial.available()) allora leggi ciò che arriva attraverso while(Serial.available())
  //  - decodifica quello che leggi salvandolo in un array frameReceived
  //  - confronta frameReceived con masterKeyFrameTxArray
  //  - se sono uguali, isConnectionEstabilished ritorna true
  //  - altrimenti, isConnectionEstabilished ritorna false e ritorna un errore WRONG_KEY_FRAME_FROM_MASTER

  SerialCommunicationErrorType

  Serial.write(slaveFrameTxArray, FRAME_LENGHT_BYTE);
  SerialComStatusValue = SERIAL_COM_CONNECTED;
}
*/


void Sc_WaitForConnection(){
  uint8_t slaveKeyBuffer[FRAME_LENGHT_BYTE];
  structToBuffer(slaveKeyFrame, slaveKeyBuffer);
  Serial.write(slaveKeyBuffer, FRAME_LENGHT_BYTE);
  Sc_Status = SC_STATUS_CONNECTED;
}

//Utilities function
bool compareArray(uint8_t arr1[], uint8_t arr2[], uint8_t dim){
  bool result = true;
  for(int i = 0; i < dim; i++){
    result &= (arr1[i] == arr2[i]);
  }
  return result;
}

void structToBuffer(Sc_FrameType frame, uint8_t* buf){
  buf[0] = frame.seqID;                            //uint8_t
  buf[1] = frame.masterCommands;                   //uint8_t
  buf[2] = (uint8_t)(frame.pwmFrequency >> 8);     //uint16_t, high byte
  buf[3] = (uint8_t)(frame.pwmFrequency & 0xFF);   //uint16_t, low byte
  buf[4] = frame.pwmDutyCicle;                     //uint8_t
  buf[5] = frame.auxOutput;                        //uint8_t
  buf[6] = frame.slaveFeedbackStatus;              //uint8_t
  buf[7] = (uint8_t)(frame.pumpFeedbackStatus >> 8);    //uint8_t, high byte
  buf[8] = (uint8_t)(frame.pumpFeedbackStatus & 0xFF);  //uint8_t, low byte
  buf[9] = frame.auxInputFeedback;                 //uint8_t
  buf[10] = frame.auxSlaveError;                    //uint8_t
}

void bufferToStruct(const uint8_t* buf, Sc_FrameType* frame){
  frame->seqID = buf[0];                            //uint8_t
  frame->masterCommands = buf[1];                   //uint8_t
  frame->pwmFrequency = (((uint16_t)buf[2])<<8) | ((uint16_t)buf[3]&0x00FF);
  frame->pwmDutyCicle = buf[4];                     //uint8_t
  frame->auxOutput = buf[5];                      //uint8_t
  frame->slaveFeedbackStatus = buf[6];              //uint8_t
  frame->pumpFeedbackStatus = (((uint16_t)buf[7])<<8) | ((uint16_t)buf[8]&0x00FF);
  frame->auxInputFeedback = buf[9];                 //uint8_t
  frame->auxSlaveError = buf[10];                    //uint8_t
}




void setup() {
  Sc_Init(115200); // opens serial port

  delay(1000);
  Sc_WaitForConnection();
  pinMode(13, OUTPUT);

}

bool connectionEstabilished = false;
bool complete = false;  // whether the string is complete
uint8_t myArr[FRAME_LENGHT_BYTE];
bool state = false;

void loop() {
  delay(200);
  if (complete) {
    Serial.write(myArr, FRAME_LENGHT_BYTE);
    complete = false;
  }
  if (connectionEstabilished){
    //connectionEstabilished = false;
    state = !state;
    digitalWrite(13,state);
  }
  while (Serial.available()) {
    static uint8_t i = 0;
    // get the new byte:
    myArr[i] = (uint8_t)Serial.read();
    i++;
    if (i == FRAME_LENGHT_BYTE) {
      uint8_t masterKeyBuffer[FRAME_LENGHT_BYTE];
      structToBuffer(masterKeyFrame, masterKeyBuffer);
      if (compareArray(myArr, masterKeyBuffer, FRAME_LENGHT_BYTE)){
         connectionEstabilished = true;
      }
      else{
        complete = true;
      }
      i = 0;
    }
  }
}
