export class Usuario {
    _id: {
      "$oid" : string
    };
    nombres: string;
    apellidos: string;
    username: string;
    correo: string;
    cedula: string;
    password: string;
    role: string;
    avatar: string;
    avatar_public_id: string;
    cargo: string;
    fullname: string;
    estado: string;

    constructor(_id: any, nombres: string, apellidos: string, username: string, 
                correo: string, cedula: string, password: string, role: string, avatar:string, cargo: string) {
      this._id = _id;
      this.nombres = nombres;
      this.apellidos = apellidos;
      this.username = username;
      this.correo = correo;
      this.cedula = cedula;
      this.password = password;
      this.role = role;
      this.avatar = avatar;
      this.cargo = cargo;
    }
} 