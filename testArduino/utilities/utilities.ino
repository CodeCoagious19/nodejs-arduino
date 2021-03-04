
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

Sc_FrameType frame = {
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


void stampaStruct(Sc_FrameType frame){
  Serial.println("--- --- ---");
  Serial.print(".seqID: ");Serial.println(frame.seqID);
  Serial.print(".masterCommands: ");Serial.println(frame.masterCommands);
  Serial.print(".pwmFrequency: ");Serial.println(frame.pwmFrequency);
  Serial.print(".pwmDutyCicle: ");Serial.println(frame.pwmDutyCicle);
  Serial.print(".auxOutput: ");Serial.println(frame.auxOutput);
  Serial.print(".slaveFeedbackStatus: ");Serial.println(frame.slaveFeedbackStatus);
  Serial.print(".pumpFeedbackStatus: ");Serial.println(frame.pumpFeedbackStatus);
  Serial.print(".auxInputFeedback: ");Serial.println(frame.auxInputFeedback);
  Serial.print(".auxSlaveError: ");Serial.println(frame.auxSlaveError);
  Serial.println("--- --- ---");
}

void stampaBuffer(uint8_t* buf, int dim){
  Serial.println("--- --- ---");
  for(int i=0; i<dim; i++){
    Serial.print(i);Serial.print(": ");Serial.println(buf[i]);
  }
  Serial.println("--- --- ---");
}


void setup() {
  Serial.begin(9600);
  uint8_t myBuffer[FRAME_LENGHT_BYTE];
  stampaStruct(frame);
  delay(2000);
  structToBuffer(frame, myBuffer);
  stampaBuffer(myBuffer, FRAME_LENGHT_BYTE);
  delay(2000);
  bufferToStruct(myBuffer, &frame);
  stampaStruct(frame);

}



void loop() {

}
