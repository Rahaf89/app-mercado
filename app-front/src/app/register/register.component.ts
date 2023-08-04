import { Component, OnInit } from '@angular/core';
import { UsersService } from '../users/users.service';
import { HttpClient , HttpHeaders} from  '@angular/common/http';
import { SweetAlertOptions } from 'sweetalert2';
import { ActivatedRoute, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router } from '@angular/router';
import { NgxImageCompressService } from 'ngx-image-compress';
import Swal from 'sweetalert2';
import $ from 'jquery';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  nombres: string = '';
  apellidos: string = '';
  username: string = '';
  correo: string = '';
  puesto: string = '';
  password: string = '';
  confirmPassword: string = '';
  cedula: string = '';
  role: string = '';

  delete_token: string;
  public_id: string;

  urlPreview: any = '';
  public estados : any = [{'nombre' : 'Caracas'}, {'nombre' : 'Monagas'}, {'nombre' : 'Tachira'}]
  public archivo : any = [];
  
  passwordError: boolean;
  bSend = false;

  constructor(public userService: UsersService, 
              private router: Router, 
              private  httpClient:  HttpClient, 
              private imageCompress: NgxImageCompressService) {}

  ngOnInit() {
    this.role = "USER";
  }

  public capturarImagen(event){
    var  fileName : any;
    const archivoEncontrado = event.target.files[0];
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

  public clickEliminarImagen(){

    var inputAvatar = <HTMLInputElement> document.getElementById('avatar');

    if(inputAvatar !== null){
       inputAvatar.value = '';
    }

    this.archivo = [];
    this.urlPreview = '';
  }


  public compressFile(image, fileName) {
        var orientation = -1;

        console.warn('Size in bytes is now:',  this.imageCompress.byteCount(image)/(1024*1024));
        
        this.imageCompress.compressFile(image, orientation, 50, 50).then(
        result => {
            this.urlPreview = result;
            
            console.warn('Size in bytes after compression:',  this.imageCompress.byteCount(result)/(1024*1024));
            // create file from byte
            const imageName = fileName;
            
            // call method that creates a blob from dataUri
            // const imageBlob = this.dataURItoBlob(this.urlPreview.split(',')[1]);

            //imageFile created below is the new compressed file which can be send to API in form data
            this.archivo = new File([result], imageName, { type: 'image/jpeg' });
        });

  }

  EqualsPassword(){
    if(this.password == this.confirmPassword && 
      ((this.password !== '' || this.confirmPassword !== '') && (this.password !== undefined || this.confirmPassword !== undefined))){
      return true;
    }

    return 0;
  }

  InequalsPassword(){
    if(this.password !== this.confirmPassword && 
      ((this.password !== '' || this.confirmPassword !== '') && (this.password !== undefined || this.confirmPassword !== undefined))){
      return true;
    }

    return 0;
  }

  public clickInsertarImagen(){
    $('#avatar').click();
  }

  public register() {

    const formularioImagen = new FormData();
    formularioImagen.append('file', this.archivo);
    formularioImagen.append('upload_preset', 'avatars');

    $('#register_button').html("<li class='fa fa-spinner fa-spin fa-1x'> </li>");
    //console.log(this.estado)

    /*if(this.urlPreview !== ''){

        this.httpClient.post(`https://api.cloudinary.com/v1_1/inversiones-jr/image/upload`, formularioImagen).subscribe( 
        (response: any) => {

            this.avatar = response.secure_url;*/

            let data = {
                "nombres" :  this.nombres,
                "apellidos" :  this.apellidos,
                "correo" :  this.correo,
                "cargo" :  this.puesto,
                "cedula" :  this.cedula,
                "password" :  this.password,
                "role" : this.role
            };

            $('#register_button').html("Registrarse");

            this.userService
              .postUrl('user', data)
              .then(response => {
                  if(response.correo.length > 0){
                    this.bSend = true;
                    this.messageSuccessfully();
                    this.router.navigate(['/login']);
                  }
              })
              .catch(data =>{
                   this.errorOcurred(data.error.err.message)
              });

        /*}, 
        (err : any) => {
            $('#register_button').html("Registrarse");
            console.log(err)
            this.errorOcurred(err.statusText);
        });
    }else{

            let data = {
                "nombre" :  this.nombre,
                "apellido" :  this.apellido,
                "username" :  this.username,
                "email" :  this.email,
                "telefono" :  this.telefono,
                "password" :  this.password,
                "role" :  this.role,
                "avatar" :  'https://res.cloudinary.com/ucab/image/upload/v1623484253/foto-perfil-defecto_pfsou3.jpg',
                "avatar_public_id" :  '',
                "puesto" :  this.puesto,
                "estado" : this.estado
            };

            this.userService
              .postUrl('register', data)
              .then(response => {
                   $('#register_button').html("Registrarse");
                   console.log(response);

                   this.bSend = true;
                   this.messageSuccessfully();
                   this.router.navigate(['/login']);
              })
              .catch(data =>{
                   $('#register_button').html("Registrarse");
                   this.errorOcurred(data.error.err.message)
              });

    }*/
  }

  private messageSuccessfully() {
    let config: SweetAlertOptions = {
      title: 'Usuario registrado satisfactoriamente',
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

  public backClicked() {
    window.history.back();
  }
}
