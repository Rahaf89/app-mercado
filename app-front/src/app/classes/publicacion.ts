export class Publicacion {
    _id: string;
    descripcion: string;
    idUser: string;
    avatar: string;
    imagen: string;
    imagen_public_id: string;
    cantidad_comentarios: number;
    time: string;

    constructor(_id: string, descripcion: string, idUser: string, imagen: string, avatar: string) {
      this._id = _id;
      this.descripcion = descripcion;
      this.idUser = idUser;
      this.imagen = imagen;
      this.avatar = avatar;
    }
} 