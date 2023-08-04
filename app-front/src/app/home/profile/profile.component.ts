import { Component, OnInit, ElementRef, AfterViewInit, Renderer2} from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../environments/environment';
import { UsersService } from '../../users/users.service';
import { Usuario } from "../../classes/usuario";
import { Tarea } from "../../classes/tarea";
import { Actividad } from "../../classes/actividad";
import { isNullOrUndefined } from 'util';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient , HttpHeaders} from  '@angular/common/http';
import { SweetAlertOptions } from 'sweetalert2';
import { NgxImageCompressService } from 'ngx-image-compress';
import Swal from 'sweetalert2';
import $ from 'jquery';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public propertyForm : FormGroup;
  public username : any; //Del perfil del usuario
  public roleCurrent : any;
  public usernameCurrent : any; //Del usuario en linea
  public usuario : Usuario = new Usuario('','','','','','','','','','');
  public tareas : Tarea[] = [];
  public activities : Actividad[] = [];
  public archivo : any = [];
  public urlPreview: any = '';


  // Variables para edicion
  public id : any;
  public nombres: any;
  public apellidos: any;
  public correo: any;
  public cedula: any;
  public cargo: any;
  public avatar: any;
  public avatar_public_id: any;
  public usernameOld : any;
  public role : any;
  public products : any[] = [];
  public orders : any[] = [];
  public modalReference: any;
  public closeResult: string;
  public invited: number = 0;
  public accepted: number = 0;

  public Descripcion: string = "";
  public cantidad_mensajes: number = 0;

  constructor(private modalService: NgbModal, private _formBuilder: FormBuilder, 
          private service: UsersService, private service2: UsersService, private router: ActivatedRoute, private Redirect: Router, 
          private  httpClient:  HttpClient,
          private imageCompress: NgxImageCompressService) { }

  ngOnInit() {

    this.archivo.name = '';
    this.username = this.router.snapshot.paramMap.get('username');
    this.roleCurrent = localStorage.getItem('role');
    this.usernameCurrent = localStorage.getItem('email');

    this.getUser();
    //this.getCantidadMensajes();
    this.createFormChangePassword();

  }

  open(content) {

    this.modalReference = this.modalService.open(content, { size: 'lg', centered: true });

    this.modalReference.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  public capturarImagen(event){
    var  fileName : any;
    const archivoEncontrado = event.target.files[0];

    if(this.archivo.name !== archivoEncontrado.name){
      
      this.archivo = archivoEncontrado;
      fileName = this.archivo['name'];

      if (event.target.files && event.target.files[0]) {
        var reader = new FileReader();

        reader.onload = (event: ProgressEvent) => {
          this.urlPreview = (<FileReader>event.target).result;
          this.compressFile(this.urlPreview, fileName)
        }

        reader.readAsDataURL(event.target.files[0]);
      }

    }
  }

  public compressFile(image, fileName) {
        // var orientation = -1;

        // console.warn('Size in bytes is now:',  this.imageCompress.byteCount(image)/(1024*1024));
        
        // this.imageCompress.compressFile(image, orientation, 50, 50).then(
        // result => {
        //     this.urlPreview = result;
            
        //     // Compress the image and change the file archivo
        //     console.warn('Size in bytes after compression:',  this.imageCompress.byteCount(result)/(1024*1024));
        //     const imageName = fileName;
        //     this.archivo = new File([result], imageName, { type: 'image/jpeg' });


        //     //Asign form for send to cloundinary
        //     const formularioImagen = new FormData();
        //     formularioImagen.append('file', this.archivo);
        //     formularioImagen.append('upload_preset', 'avatars');

        //     $('#boton_editar').html("<li class='fa fa-spinner fa-spin fa-1x'> </li>");

        //     this.httpClient.post(`https://api.cloudinary.com/v1_1/inversiones-jr/image/upload`, formularioImagen).subscribe( 
        //     (response: any) => {

        //         let data = {
        //           "avatar" : response.secure_url,
        //           "avatar_public_id" : response.public_id
        //         }

        //         $('#boton_editar').html("Editar");

        //         this.service
        //           .putUrl('users/imagen/{username}', data, [this.username])
        //           .then(response => {
        //                   this.usuario = response;
        //                   this.avatar = this.usuario.avatar;
        //                   this.avatar_public_id = this.usuario.avatar_public_id;
        //           })
        //           .catch(data =>{
        //              console.log(data.error)
        //           });

        //     }, 
        //     (err : any) => {
        //       this.errorOcurred('No hay conexión');
        //     });
        // });

  }

  public changeImage(){
    $('#archivo').click();
  }

  public deleteImage(){

    if(this.avatar_public_id !== ''){

        let data = {
          avatar : 'https://res.cloudinary.com/ucab/image/upload/v1623484253/foto-perfil-defecto_pfsou3.jpg',
          avatar_public_id : ''
        }
              
        this.service
        .putUrl('users/imagen/{username}', data, [this.username])
        .then(response => {
          this.usuario = response;
          this.avatar = this.usuario.avatar;
          this.avatar_public_id = this.usuario.avatar_public_id;
        })
        .catch(data =>{
           console.log(data.error)
        });

    }
  }

  private getDateToday(): string{

    var hoy = new Date();
    var fecha = hoy.getDate() + '-' + ( hoy.getMonth() + 1 ) + '-' + hoy.getFullYear();

    if(hoy.getMinutes() < 10){
      var hora = hoy.getHours() + ':0' + hoy.getMinutes() + ':' + hoy.getSeconds();
    }else{
      var hora = hoy.getHours() + ':' + hoy.getMinutes() + ':' + hoy.getSeconds();
    }

    var now = fecha + ' ' + hora;

    console.log(now);

    return now;
  }

  public getOrder(){
    this.service.getUrl('order/{id}/user', [this.usuario._id.$oid])
    .then(data => { 
      this.orders = data;
      this.getProducts();
    })
    .catch(data =>{});
  }

  public getProduct(id : any){
    for (let index = 0; index < this.products.length; index++) {
      if(id == this.products[index]._id.$oid){
        return this.products[index].nombre;
      }
    }
  }

  public getAmountProduct(id : any){
    for (let index = 0; index < this.products.length; index++) {
      if(id == this.products[index]._id.$oid){
        return this.products[index].precio + ' ' + this.products[index].moneda;
      }
    }
  }

  public getProducts(){
    this.service.getUrl('product')
    .then(data => {
      this.products = data;
    })
    .catch(data => {});
  }

  // public getCantidadMensajes(){

  //   this.service2.getUrl('mensajes/count/{id}', [this.username])
  //   .then(response => {
  //     this.cantidad_mensajes = response.length

  //     console.log(this.cantidad_mensajes)
  //   })
  //   .catch(error => {
  //     console.log(error)
  //   })
  // }

  // public setMensajes(){

  //   let time = this.getDateToday();

  //     let data = {
  //             "descripcion": this.Descripcion,
  //             "idUserTransmitter": localStorage.getItem('username'),
  //             "idUserReceipt": this.username,
  //             "time" : time,
  //             "show" : 0,
  //             "imagen" : '',
  //             "imagen_public_id" : ''
  //           };

  //     this.service.postUrl('mensajes', data)
  //     .then(response => {
  //       console.log(response._id)
  //           if(response._id !== undefined){
              
  //             if(this.cantidad_mensajes == 0){
  //                 let data = {
  //                   "idUserTransmitter": localStorage.getItem('username'),
  //                   "idUserReceipt": this.username,
  //                   "numero_mensajes" : 1
  //                 };

  //                this.service.postUrl('bandejas', data)
  //                 .then(response => {
  //                     this.messageSwal("Mensaje enviado. Dirigase al panel de mensajes");
  //                     this.modalReference.close();
  //                     this.limpiarInputDescription();
  //                 })
  //                 .catch(error => {
  //                   console.log(error)
  //                 })
  //              }else{
  //                 this.messageSwal("Mensaje enviado. Dirigase al panel de mensajes");
  //                 this.modalReference.close();
  //                 this.limpiarInputDescription();
  //              }
  //           }
  //       })
  //       .catch(data =>{
  //           console.log(data.error)
  //       });
  // }

  public limpiarInputDescription(){
    this.propertyForm.get('Descripcion').setValue("");
  }

  public getUser(){
      this.service.getUrl('user/' + this.username + '/email')
      .then(data => { 
        this.usuario = data;

        this.nombres = this.usuario.nombres;
        this.apellidos = this.usuario.apellidos;
        this.correo = this.usuario.correo;
        this.cedula = this.usuario.cedula;
        this.cargo = this.usuario.cargo;
        this.usernameOld = this.usuario.correo;
        this.username = this.usuario.correo;
        this.role = this.usuario.role;
        this.id = this.usuario._id.$oid;
        
        console.log( this.usuario);

        this.getOrder();
      })
    .catch(data =>{});
  }

  public changeUser(){

    let data = {
      "nombres": this.nombres,
      "apellidos": this.apellidos,
      "correo": this.correo,
      "cedula": this.cedula,
      "cargo": this.cargo
    };

    this.service.putUrl('user/{id}', data, [this.id])
    .then(response => {
        console.log(response)
        this.nombres = response.nombres;
        this.apellidos = response.apellidos;
        this.correo = response.correo;
        this.cedula = response.cedula;
        this.cargo = response.cargo;
        
        if(this.correo == localStorage.getItem('email')) localStorage.setItem('email', response.correo);
        
        this.usernameOld = response.correo;
        this.username = response.correo;

        this.modalReference.close();
        this.getUser();

        if(document.location.href.indexOf('myprofile') !== -1){
            var URL = '/home/myprofile/'+localStorage.getItem('email');
        }else{
            var URL = '/home/profile/'+localStorage.getItem('email');
        }

        this.editingSuccessfully();
        this.Redirect.navigateByUrl(URL);
    })
    .catch(data =>{
        this.errorOcurred(data.error);
    });
  }

  public eliminarUsuario(){
    this.confirmDeleteUser();
  }

  public convertirAdmin(){
    var inputImagePut = <HTMLInputElement> document.getElementById('adminSwitches');

     if(inputImagePut.checked){
          let data = { 
            "role" : "ADMIN"
          };

          this.service.putUrl('user/{id}/role', data, [this.usuario._id.$oid])
            .then(response => {
              console.log(response);
              console.log("Peticion enviado y satisfactoria");
              this.getUser();
            })
            .catch(data =>{
                console.log(data.error)
            });
     }else{
         let data = { 
            "role" : "USER"
         };

          this.service.putUrl('user/{id}/role', data, [this.usuario._id.$oid])
            .then(response => {
              console.log(response)
              console.log("Peticion enviado y satisfactoria");
              if(this.username == localStorage.getItem('username')) localStorage.setItem('role', response.role);
              this.getUser();
            })
            .catch(data =>{
                console.log(data.error)
            });
     }
  }

  public CheckInvite(){
    this.service.getUrl('solicitudes/{idUserTransmitter}/invite/{idUserReceipt}', [this.usernameCurrent, this.username])
    .then(response => {
      if(response.length !== 0){
        this.invited = 1;

        if(response[0].accepted == 1){
          this.accepted = 1;
        }
      }
    })
    .catch(data =>{
        this.errorOcurred(data);
    });
  }

  public sendInvite(){
    let data = {
      "idUserTransmitter": this.usernameCurrent,
      "idUserReceipt": this.username,
      "showTransmitter": 0,
      "showReceipt": 0,
      "accepted": 0
    };

    this.service.postUrl('solicitudes', data)
      .then(response => {
        if(response._id !== undefined){
             this.messageSwal("Solicitud Enviada");
             this.CheckInvite();
        }
      })
      .catch(data =>{
          this.errorOcurred(data);
      });
  }

  public deleteInvite(){
      this.service.deleteUrl('solicitudes/{idUserTransmitter}/delete/{idUserReceipt}', [this.usernameCurrent, this.username])
      .then(response => {
        if(response._id !== undefined){
          this.invited = 0;
          this.messageSwal("Solicitud Cancelada");
        }
      })
      .catch(data =>{
          this.errorOcurred(data);
      });
  }

  public createFormChangePassword(){
      this.propertyForm = this._formBuilder.group({
        password: ['', Validators.required],
        passwordNew: ['', Validators.required]
      });
  }

  public changePassword(){

    let data = {
      "password": this.propertyForm.get('password').value,
      "passwordNew": this.propertyForm.get('passwordNew').value,
    };

    this.service.putUrl('user/{id}/changepassword', data, [this.usuario._id.$oid])
      .then(response => {
        console.log(response)
        if(response._id !== undefined){
             this.messageSuccessfully();
             this.propertyForm.get('password').setValue("");
             this.propertyForm.get('passwordNew').setValue("");
        }
      })
      .catch(data =>{
          this.errorOcurred(data.error.err.message);
      });
  }

   private messageSwal(title : any) {
    let config: SweetAlertOptions = {
      title: title,
      type: 'success',
      showConfirmButton: false,
      timer: 2500
    };

    Swal.fire(config).then(result => {
    });
  }

  private messageSuccessfully() {
    let config: SweetAlertOptions = {
      title: 'Contraseña cambiada satisfactoriamente',
      type: 'success',
      showConfirmButton: false,
      timer: 2500
    };

    Swal.fire(config).then(result => {
    });
  }

  private editingSuccessfully() {
    let config: SweetAlertOptions = {
      title: 'Los datos del usuario han sido editados satisfactoriamente',
      type: 'success',
      showConfirmButton: false,
      timer: 2500
    };

    Swal.fire(config).then(result => {
    });
  }

  private deleteSuccessfully() {
    let config: SweetAlertOptions = {
      title: 'El usuario ha sido eliminado satisfactoriamente',
      type: 'success',
      showConfirmButton: false,
      timer: 2500
    };

    Swal.fire(config).then(result => {
    });
  }

  private errorOcurred(message) {
    let config: SweetAlertOptions = {
      title: message,
      type: 'error',
      showConfirmButton: true
    };

    Swal.fire(config).then(result => {
    });
  }

  private confirmDeleteUser(){
    let config: SweetAlertOptions = {
      title: "Esta seguro que desea eliminar esta cuenta? Se eliminara permanentemente.",
      type: 'warning',
      showConfirmButton: true,
      showCancelButton:true,
      cancelButtonText:"No",
      confirmButtonColor:"#3085d6",
      confirmButtonText:'Si, eliminalo!',
    };

    Swal.fire(config).then(result => {

      if(result.value == true){
        this.service.deleteUrl('user/{id}', [this.usuario._id.$oid])
        .then(data => {  
           this.deleteSuccessfully();
           this.modalReference.close();

           if(this.usernameCurrent == this.username){

             localStorage.removeItem('token');
             localStorage.removeItem('email');
             localStorage.removeItem('role');
             localStorage.removeItem('username');
             localStorage.removeItem('avatar');
             localStorage.setItem('isLoggedIn', "false");  

             this.Redirect.navigateByUrl('/login');
           }else{
             this.Redirect.navigateByUrl('/home');
           }
        })
        .catch(data =>{
           this.errorOcurred(data.error.err.message);
        });
      } 

    });
  }

}
