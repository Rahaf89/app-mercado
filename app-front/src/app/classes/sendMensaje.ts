export class sendMensaje {
    _id: string;
    idUserTransmitter: string;
    idUserReceipt: string;
    numero_mensajes: number;
    avatar: string;
    time: string;

    constructor(_id: string, idUserTransmitter: string, idUserReceipt: string) {
      this._id = _id;
      this.idUserTransmitter = idUserTransmitter;
      this.idUserReceipt = idUserReceipt;
    }
}