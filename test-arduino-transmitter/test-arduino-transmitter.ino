uint8_t number_8[2];

uint16_t number_16 = 50321;


void setup(){
  Serial.begin(115200);
}  
void loop(){
  //number_8[0] = number_16 & 0xFF;
  //number_8[1] = (number_16 >> 8);
  number_8[0] = (number_16 >> 8);
  number_8[1] = number_16 & 0xFF;
  Serial.write(number_8, 2);
  delay(1000);
}
