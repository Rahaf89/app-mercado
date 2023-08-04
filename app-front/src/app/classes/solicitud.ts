export class Solicitud {
    _id : string;
    idUserTransmitter: string;
    idUserReceipt: string;
    showReceipt: number;
    showTransmitter: number;
    accepted: number;
    
    constructor(_id : string, idUserTransmitter: string, idUserReceipt: string, 
                showReceipt: number, showTransmitter: number, accepted: number) {
      this._id  = _id ;
      this.idUserTransmitter = idUserTransmitter;
      this.idUserReceipt = idUserReceipt;
      this.showReceipt = showReceipt;
      this.showTransmitter = showTransmitter;
      this.accepted = accepted;
    }
} 