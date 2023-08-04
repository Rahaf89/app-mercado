import { Component, OnInit, ElementRef, AfterViewInit, Renderer2} from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { UsersService } from '../../users/users.service';
import { Router } from '@angular/router';
import { HttpClient , HttpHeaders} from  '@angular/common/http';
import { NgxImageCompressService } from 'ngx-image-compress';

@Component({
  selector: 'app-post-fake-news',
  templateUrl: './post-fake-news.component.html',
  styleUrls: ['./post-fake-news.component.css']
})
export class PostFakeNewsComponent implements OnInit {
  
  public propertyForm: FormGroup;
  public closeResult: string;
  public modalReference: any;
  public username : any;
  public role : any;
  public descriptionPut : any;
  public idPut : any;
  public imagePut : any;
  public publicaciones : any = [];
  public archivo : any = [];
  public part : any = 5;
  public urlPreview : any = '';
  public textoSeleccionadoAnalisis : String = '';
  public textoFakeorReal:{Fake:string, Real:string} = {Fake:'', Real:''}
  constructor(private modalService: NgbModal, private _formBuilder: FormBuilder, 
  			  private service: UsersService, private router: Router, private  httpClient:  HttpClient,
  			  private imageCompress: NgxImageCompressService) {
	}

	ngOnInit() {

		this.username = localStorage.getItem('username');
		this.role = localStorage.getItem('role');
    
	}

  public buscarUsuario(){
    let usuario = document.getElementById('form1')['value'];
    
    console.log(usuario);
    this.getPostUser(usuario)
  }
  public getPostUser(usuario){
		this.service.getUrl('post/'+usuario+'/user')
		.then(data => { 
		this.publicaciones = data;
		console.log(this.publicaciones);
	})
	.catch(data =>{});
	}

  open(text, content) {
    var respuestaFakeOrRReal={}
    this.textoSeleccionadoAnalisis = text;
		this.modalReference = this.modalService.open(content, { size: 'lg', centered: true});
    this.service.getUrl('post/'+text+'/publicacion')
		.then(data => { 
      
      respuestaFakeOrRReal=data;
      if(respuestaFakeOrRReal[0].label== 'FAKE'){
        this.textoFakeorReal.Fake = ((respuestaFakeOrRReal[0].score)*100).toFixed(2);
        this.textoFakeorReal.Real = ((1-respuestaFakeOrRReal[0].score)*100).toFixed(2);
      }
      else{
        this.textoFakeorReal.Real = ((respuestaFakeOrRReal[0].score)*100).toFixed(2);
        this.textoFakeorReal.Fake = ((1-respuestaFakeOrRReal[0].score)*100).toFixed(2);
      }
    })
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

}
