export class Partners {
    _id : string;
    description: string;
    name: string;
    phone: string;
    email: string;
    createBy: string;
    
    constructor(_id : string, description: string, name: string, phone: string, email: string) {
      this._id  = _id ;
      this.description = description;
      this.name = name;
      this.phone = phone;
      this.email = email;
    }
} 