export class Mensaje {
    _id: string;
    descripcion: string;
    idUserTransmitter: string;
    idUserReceipt: string;
    avatar: string;
    imagen: string;
    imagen_public_id: string;
    show: number;
    time: string;

    constructor(_id: string, descripcion: string, idUserTransmitter: string, idUserReceipt: string, imagen: string, avatar: string) {
      this._id = _id;
      this.descripcion = descripcion;
      this.idUserTransmitter = idUserTransmitter;
      this.idUserReceipt = idUserReceipt;
      this.imagen = imagen;
      this.avatar = avatar;
    }
} 