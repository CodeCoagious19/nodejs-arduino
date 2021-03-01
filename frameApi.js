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
            slaveFeedbackStatus: 0,
            pumpFeedback_ms: 0,
            auxInputFeedback: 0,
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
        slaveFeedbackStatus: slaveFeedbackStatus,
        pumpFeedback_ms: pumpFeedback_ms,
        auxInputFeedback: auxInputFeedback,
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
        this.setSlaveFeedbackStatus(packet.slaveFeedbackStatus);
        this.setPumpFeedback_ms(packet.pumpFeedback_ms);
        this.setAuxInputFeedback(packet.auxInputFeedback);
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
    setSlaveFeedbackStatus(slaveFeedbackStatus){
        if (slaveFeedbackStatus != undefined){
            this._packet.slaveFeedbackStatus = slaveFeedbackStatus;
        }
    }
    setPumpFeedback_ms(pumpFeedback_ms){
        if(pumpFeedback_ms != undefined){
            this._packet.pumpFeedback_ms = pumpFeedback_ms;
        }
    }
    setAuxInputFeedback(auxInputFeedback){
        if(auxInputFeedback != undefined){
            this._packet.auxInputFeedback = auxInputFeedback;
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
    getSlaveFeedbackStatus(){
        return this._packet.slaveFeedbackStatus;
    }
    getPumpFeedback_ms(){
        return this._packet.pumpFeedback_ms;
    }
    getAuxInputFeedback(){
        return this._packet.auxInputFeedback;
    }
    getAuxSlaveError(){
        return this._packet.auxSlaveError;
    }

    //Metodi avanzati
    assignFromBuffer(buffer) {
        const arr = [...buffer];
        let index = 0;
        for (const key in this._packet) {
            this._packet[key] = arr[index];
            index++;
        }
        return this._packet;
    }

    convertToBuffer(){
        const arr = []; 
        for (const key in this._packet) {
            arr.push(this._packet[key])
        }
        return Buffer.from(arr);
    }

}

module.exports = { Frame: Frame };
