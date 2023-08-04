import { Component, OnInit, ElementRef, AfterViewInit, Renderer2} from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../environments/environment';
import { UsersService } from '../../users/users.service';
import { Publicacion } from "../../classes/publicacion";
import { Mensaje } from "../../classes/mensaje";
import { sendMensaje } from "../../classes/sendMensaje";
import { Usuario } from "../../classes/usuario";
import { isNullOrUndefined } from 'util';
import { Router } from '@angular/router';
import { HttpClient , HttpHeaders} from  '@angular/common/http';
import { NgxImageCompressService } from 'ngx-image-compress';
import $ from 'jquery';
import Swal, { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-panel-messages',
  templateUrl: './panel-messages.component.html',
  styleUrls: ['./panel-messages.component.css']
})
export class PanelMessagesComponent implements OnInit {
  public propertyForm: FormGroup;
  public closeResult: string;
  public modalReference: any;
  public username : any;
  public role : any;
  public descriptionPut : any;
  public idPut : any;
  public imagePut : any;
  public mensajes : sendMensaje[] = [];
  public usuarios : Usuario[] = []
  public archivo : any = [];
  public part : any = 5;
  public urlPreview : any = '';

  constructor(private modalService: NgbModal, private _formBuilder: FormBuilder, 
          private service: UsersService, private router: Router, private  httpClient:  HttpClient,
          private imageCompress: NgxImageCompressService) {
  }

  ngOnInit() {
    this.username = localStorage.getItem('username');
    this.getMensaje();

    const onScroll = () => {

     if(this.part <= this.mensajes.length){
       if (document.body.scrollHeight - window.innerHeight - 500 <= window.scrollY) {
         // hacer fetch
         console.log('estoy en el final del scroll')
         this.masMensajes();
       }
     }

    }

    window.addEventListener('scroll', onScroll)
  }

  public getMensaje(){

    $('#spinner').show();

    this.service.getUrl('bandejas/part/{cont}/{id}', [this.part, this.username])
      .then(data => { 
        
        this.service.getUrl('users')
        .then(data2 => { 
          $('#spinner').hide();
          
          this.mensajes = data;
          this.usuarios = data2;

          for(var i=0; i < this.usuarios.length; i++){
            for(var j=0; j < this.mensajes.length; j++){
              if(this.usuarios[i].username == this.mensajes[j].idUserTransmitter || this.usuarios[i].username == this.mensajes[j].idUserReceipt){
                this.mensajes[j].avatar = this.usuarios[i].avatar;
              }
            }
          }

          this.mensajes.reverse();
          
        })
        .catch(data =>{});
      
      })
      .catch(data =>{});
  }


  public masMensajes(){
    this.part = this.part + 5;
    this.getMensaje();
  }

}
