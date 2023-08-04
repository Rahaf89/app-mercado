import { Component, OnInit, ElementRef, AfterViewInit, Renderer2} from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { UsersService } from '../../users/users.service';
import { Router } from '@angular/router';
import { HttpClient , HttpHeaders} from  '@angular/common/http';
import { NgxImageCompressService } from 'ngx-image-compress';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  
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

  constructor(private modalService: NgbModal, private _formBuilder: FormBuilder, 
  			  private service: UsersService, private router: Router, private  httpClient:  HttpClient,
  			  private imageCompress: NgxImageCompressService) {
	}

	ngOnInit() {

		this.username = localStorage.getItem('username');
		this.role = localStorage.getItem('role');
		this.getPost();

	}


  public getPost(){
		this.service.getUrl('post')
		.then(data => { 
		this.publicaciones = data;
		console.log(this.publicaciones);
	})
	.catch(data =>{});
	}
}
