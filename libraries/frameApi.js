class Frame {
    constructor() {
        this._packet = {
            /*Section1*/
            seqId: 0,
            /*Section2*/
            masterCommands: 0,
            pwmFrequency: 0,
            pwmDutyCicle: 0,
            auxOutput: 0,
            /*Section3*/
            slaveStatus: 0,
            pumpFeedback_ms: 0,
            auxInput: 0,
            auxSlaveError: 0
        }
    }

    set packet(packet = {
        /*Section1*/
        seqId: seqId,
        /*Section2*/
        masterCommands: masterCommands,
        pwmFrequency: pwmFrequency,
        pwmDutyCicle: pwmDutyCicle,
        auxOutput: auxOutput,
        /*Section3*/
        slaveStatus: slaveStatus,
        pumpFeedback_ms: pumpFeedback_ms,
        auxInput: auxInput,
        auxSlaveError: auxSlaveError

    }){
        /*Section1*/
        this.setSeqId(packet.seqId);
        /*Section2*/
        this.setMasterCommands(packet.masterCommands);
        this.setPwmFrequency(packet.pwmFrequency);
        this.setPwmDutyCicle(packet.pwmDutyCicle);
        this.setAuxOutput(packet.auxOutput);
        /*Section3*/
        this.setSlaveStatus(packet.slaveStatus);
        this.setPumpFeedback_ms(packet.pumpFeedback_ms);
        this.setAuxInput(packet.auxInput);
        this.setAuxSlaveError(packet.auxSlaveError);
    }

    get packet(){
        return this._packet;
    }

    //Metodi get/set delle singole proprietà

    //SET

    /*Section1*/
    setSeqId(seqId){
        if(seqId != undefined){
            this._packet.seqId = seqId;
        }
    }
    /*Section2*/
    setMasterCommands(masterCommands){
        if(masterCommands != undefined){
            this._packet.masterCommands = masterCommands;
        }
    }
    setPwmFrequency(pwmFrequency){
        if(pwmFrequency != undefined){
            this._packet.pwmFrequency = pwmFrequency;
        }
    }
    setPwmDutyCicle(pwmDutyCicle){
        if(pwmDutyCicle != undefined){
            this._packet.pwmDutyCicle = pwmDutyCicle;
        }
    }
    setAuxOutput(auxOutput){
        if(auxOutput != undefined){
            this._packet.auxOutput = auxOutput;
        }
    }
    /*Section2*/
    setSlaveStatus(slaveStatus){
        if (slaveStatus != undefined){
            this._packet.slaveStatus = slaveStatus;
        }
    }
    setPumpFeedback_ms(pumpFeedback_ms){
        if(pumpFeedback_ms != undefined){
            this._packet.pumpFeedback_ms = pumpFeedback_ms;
        }
    }
    setAuxInput(auxInput){
        if(auxInput != undefined){
            this._packet.auxInput = auxInput;
        }
    }
    setAuxSlaveError(auxSlaveError){
        if(auxSlaveError != undefined){
            this._packet.auxSlaveError = auxSlaveError;
        }
    }

    //GET

    /*Section1*/
    getSeqId(){
        return this._packet.seqId;
    }
    /*Section2*/
    getMasterCommands(){
        return this._packet.masterCommands;
    }
    getPwmFrequency(){
        return this._packet.pwmFrequency;
    }
    getPwmDutyCicle(){
        return this._packet.pwmDutyCicle;
    }
    getAuxOutput(){
        return this._packet.auxOutput;
    }
    /*Section2*/
    getSlaveStatus(){
        return this._packet.slaveStatus;
    }
    getPumpFeedback_ms(){
        return this._packet.pumpFeedback_ms;
    }
    getAuxInput(){
        return this._packet.auxInput;
    }
    getAuxSlaveError(){
        return this._packet.auxSlaveError;
    }

    //Metodi avanzati
    assignFromBuffer(buffer) {
        const arr = [...buffer];
        /*Section1*/
        this._packet.seqId = arr[0];
        /*Section2*/
        this._packet.masterCommands = arr[1];
        this._packet.pwmFrequency = (arr[2]<<8) | (arr[3]);
        this._packet.pwmDutyCicle = arr[4];
        this._packet.auxOutput = arr[5];
        /*Section3*/
        this._packet.slaveStatus = arr[6];
        this._packet.pumpFeedback_ms = (arr[7]<<8) | (arr[8]);
        this._packet.auxInput = arr[9];
        this._packet.auxSlaveError = arr[10];

    }

    convertToBuffer(){
        const arr = [];
        /*Section1*/
        arr[0] = this._packet.seqId;
        /*Section2*/
        arr[1] = this._packet.masterCommands;
        arr[2] = this._packet.pwmFrequency >> 8;
        arr[3] = this._packet.pwmFrequency & 0xFF;
        arr[4] = this._packet.pwmDutyCicle;
        arr[5] = this._packet.auxOutput;
        /*Section3*/
        arr[6] = this._packet.slaveStatus;
        arr[7] = this._packet.pumpFeedback_ms >> 8;
        arr[8] = this._packet.pumpFeedback_ms & 0xFF;
        arr[9] = this._packet.auxInput;
        arr[10] = this._packet.auxSlaveError;
        return Buffer.from(arr);
    }

}

module.exports = { Frame: Frame };
