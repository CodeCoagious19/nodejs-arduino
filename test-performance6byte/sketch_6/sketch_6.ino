void setup()
{
  // Open serial communications and wait for port to open:
  Serial.begin(115200);
}
 
void loop() // run over and over
{
  static uint8_t myBuf[6];
  if (Serial.available() == 6){
    Serial.readBytes(myBuf, 6);
    Serial.write(myBuf, 6);
  }
}
