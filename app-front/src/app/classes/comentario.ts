export class Comentario {
    _id: string;
    descripcion: string;
    idUser: string;
    idPublicacion: string;
    avatar: string;

    constructor(_id: string, descripcion: string, idUser: string, avatar: string) {
      this._id = _id;
      this.descripcion = descripcion;
      this.idUser = idUser;
      this.avatar = avatar;
    }
} 