import { Component, OnInit, ElementRef, AfterViewInit, Renderer2} from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../environments/environment';
import { UsersService } from '../../users/users.service';
import { Partners } from "../../classes/partners";
import { isNullOrUndefined } from 'util';
import { Router, ActivatedRoute } from '@angular/router';
import $ from 'jquery';

@Component({
  selector: 'app-partners',
  templateUrl: './partners.component.html',
  styleUrls: ['./partners.component.css']
})
export class PartnersComponent implements OnInit {

  public propertyForm: FormGroup;
	public closeResult: string;
	public modalReference: any;
	public modalReference2: any;
	public username : any;
	public role : any;
	public partner : any;
	public Partners : Partners[] = []
	public part : any = 5;

	public nombrePut : any;
	public descripcionPut : any;
	public phonePut : any;
	public emailPut : any;
	public idPut : any;

	constructor(private modalService: NgbModal, private modalService2: NgbModal, private _formBuilder: FormBuilder, 
				  private service: UsersService, private service2: UsersService, private router: Router) {}

	ngOnInit() {

		this.username = localStorage.getItem('username');
		this.role = localStorage.getItem('role');
		this.createForm();
		this.getPartners();
	}

	open(content, id : any, description : any) {
		this.idPut = id;
		this.descripcionPut = description;

		this.modalReference = this.modalService.open(content, { size: 'lg', centered: true});

		this.modalReference.result.then((result) => {
		  this.closeResult = `Closed with: ${result}`;
		}, (reason) => {
		  this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
		});
	}

	editPartners(content, id : any, nombre : any, descripcion : any, phone : any, fecha : any){

		this.modalReference2.close();

		this.idPut = id;
		this.nombrePut = nombre;
		this.descripcionPut = descripcion;
		this.phonePut = phone;
		this.emailPut = fecha;

		this.modalReference = this.modalService.open(content, { size: 'lg', centered: true});

		this.modalReference.result.then((result) => {
		  this.closeResult = `Closed with: ${result}`;
		}, (reason) => {
			this.limpiarInputDescription();
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

	public getDateToday(): string{

		var hoy = new Date();
		var fecha = hoy.getFullYear() + '-' + ( hoy.getMonth() + 1 ) + '-' + hoy.getDate();

		if(hoy.getMinutes() < 10){
			var hora = hoy.getHours() + ':0' + hoy.getMinutes() + ':' + hoy.getSeconds();
		}else{
			var hora = hoy.getHours() + ':' + hoy.getMinutes() + ':' + hoy.getSeconds();
		}

		var now = fecha + ' ' + hora;

		console.log(now);

		return now;
	}

	public getPartners(){
		this.Partners = [];

		this.service.getUrl('partners/part/{count}/{id}', [this.part, this.username])
		.then(data => { 
			this.Partners = data;
		})
		.catch(data =>{});
	}


	public limpiarInputDescription(){
		this.propertyForm.get('Nombre').setValue("");
		this.propertyForm.get('Descripcion').setValue("");
		this.propertyForm.get('Phone').setValue("");
		this.propertyForm.get('Email').setValue("");
	}

	setPartners(){
		let data = {
			"name": this.propertyForm.get('Nombre').value,
			"description": this.propertyForm.get('Descripcion').value,
			"phone": this.propertyForm.get('Phone').value,
			"email": this.propertyForm.get('Email').value,
			"createBy" : this.username
		};

		$('#button_agendar').html("<li class='fa fa-spinner fa-spin fa-1x'> </li>");

		this.service.postUrl('partners', data)
		.then(response => {

				$('#button_agendar').html("Agendar");
					this.modalReference.close();
					this.getPartners();
					this.limpiarInputDescription();
          console.log(response);

	    })
	    .catch(data =>{
	    		$('#button_agendar').html("Agendar");
	        console.log(data.error)
	    });
	}

	putPartners(id){

		let data = {
			"name": this.nombrePut,
			"description": this.descripcionPut,
			"phone": this.phonePut,
			"email": this.emailPut,
			"createBy" : this.username
		};

		$('#button_cambiar').html("<li> class='fa fa-spinner fa-spin fa-1x'> </li>");

		this.service.putUrl('partners/{id}', data, [id])
		.then(response => {
				$('#button_cambiar').html("Cambiar");
					this.modalReference.close();
					this.getPartners();
					this.limpiarInputDescription();
	    })
	    .catch(data =>{
	    		$('#button_cambiar').html("Cambiar");
	        console.log(data.error)
	    });
	}

	deletePartners(id){
		this.service.deleteUrl('partners/{id}', [id])
		.then(data => { 
	    	this.getPartners(); 
	    	this.modalReference2.close();
	    }).catch(data =>{});
	}

	createForm() {
	    this.propertyForm = this._formBuilder.group({
	    	Nombre: ['', Validators.required],
	    	Descripcion: ['', Validators.required],
	    	Phone: ['', Validators.required],
	    	Email: ['', Validators.required]
	    });
	}

	verPartners(content, data : any){
		this.partner = data;

		this.modalReference2 = this.modalService2.open(content, { size: 'lg', centered: true });

		this.modalReference2.result.then((result) => {
		  this.closeResult = `Closed with: ${result}`;
		}, (reason) => {
		  this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
		});
	}

	public masPartners(){
		this.part = this.part + 5;
		this.getPartners();
	}

}
