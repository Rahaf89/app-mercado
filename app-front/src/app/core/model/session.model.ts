import { Usuario } from "./usuario.model";

export class Session {
  public token: string;
  public user: Usuario;
}