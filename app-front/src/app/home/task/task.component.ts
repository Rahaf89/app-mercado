import { Component, OnInit, ElementRef, AfterViewInit, Renderer2} from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../environments/environment';
import { UsersService } from '../../users/users.service';
import { Tarea } from "../../classes/tarea";
import { Actividad } from "../../classes/actividad";
import { Usuario } from "../../classes/usuario";
import { isNullOrUndefined } from 'util';
import { Router } from '@angular/router';
import { NgSelectModule, NgOption, NgSelectConfig} from '@ng-select/ng-select';
import $ from 'jquery';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {

  public propertyForm: FormGroup;
	public closeResult: string;
	public modalReference: any;
	public modalReference2: any;
	public username : any;
	public role : any;

	public tarea : any;
	public actividad : any;
	public usuario : any;

	public tareas : Tarea[] = []
	public actividades : Actividad[] = []
	public usuarios : Usuario[] = []
	public part : any = 5;

	public nombrePut : any;
	public descripcionPut : any;
	public idUserPut : any;
	public nombreUsuario : any;
	public nombreActividad : any;
	public idActividadPut : any;
	public idPut : any;
	public status : any = [{'nombre' : 'En Progreso'}, {'nombre' : 'Hecho'}, {'nombre' : 'Archivado'}]
	public estado: any;
	public getStatusGlobal : any = '';

	public cantidadTodos : number;
	public cantidadHechos : number;
	public cantidadEnProgreso : number;
	public cantidadArchivado : number;

	constructor(private modalService: NgbModal, private modalService2: NgbModal, private _formBuilder: FormBuilder, 
				  private service: UsersService, private service2: UsersService, private service3: UsersService, private router: Router) {}

	ngOnInit() {
		this.username = localStorage.getItem('username');
		this.role = localStorage.getItem('role');
		this.createForm();
		this.getTarea();
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

	editTarea(content, id : any, nombre : any, descripcion : any, 
				idActividad : any, idUser : any, status: any){

		this.modalReference2.close();

		this.getActividadById(idActividad);
		this.getUsuarioById(idUser);

		this.idPut = id;
		this.nombrePut = nombre;
		this.descripcionPut = descripcion;
		this.idUserPut = idUser;
		this.idActividadPut = idActividad;
		this.estado = status;

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

	getTarea(status: string = ''){

		this.getStatusGlobal = status;

		let data = {
			"status": status
		};

		this.service.postUrl('tareas/part/{cont}', data, [this.part])
		.then(data => { 
			this.tareas = data;
			this.getCantidadPorTarea();
		})
		.catch(data =>{});

	}

	public getCantidadPorTarea(){
			this.service.getUrl('tareas/cantidadPorStatus')
	    .then(data => { 
	    	console.log(data);

	    	this.cantidadTodos = data.todos;
	    	this.cantidadHechos = data.cantidadHechos;
	    	this.cantidadEnProgreso = data.cantidadEnProgreso;
	    	this.cantidadArchivado = data.cantidadArchived;

	    })
	    .catch(data =>{});
	}

	getActividad(){
		this.service.getUrl('actividades')
		.then(data => { 
			this.actividades = data;			
		})
		.catch(data =>{});
	}

	getUsuario(){
		this.service2.getUrl('users')
		.then(data => { 
			this.usuarios = data;

			for(var i = 0; i < this.usuarios.length; i++){
					this.usuarios[i].fullname = this.usuarios[i].nombres + ' ' + this.usuarios[i].apellidos;
			}
		})
		.catch(data =>{});
	}

	getActividadById(id){
		this.service.getUrl('actividades/{id}', [id])
		.then(data => { 
			console.log(data)
			this.nombreActividad = data.nombre;
		})
		.catch(data =>{});
	}

	getUsuarioById(username){
		this.service2.getUrl('users/username/{username}', [username])
		.then(data => { 
			this.nombreUsuario = data.nombre + " " + data.apellido;
		})
		.catch(data =>{});
	}

	private getDateToday(): string{

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

	public limpiarInputDescription(){
		this.propertyForm.get('Nombre').setValue("");
		this.propertyForm.get('Descripcion').setValue("");
		this.propertyForm.get('idUser').setValue("");
		this.propertyForm.get('idActividad').setValue("");
	}

	public getCookie(cname) {
		let name = cname + "=";
		let decodedCookie = decodeURIComponent(document.cookie);
		let ca = decodedCookie.split(';');
		for(let i = 0; i <ca.length; i++) {
			let c = ca[i];
			while (c.charAt(0) == ' ') {
				c = c.substring(1);
			}
			if (c.indexOf(name) == 0) {
				return c.substring(name.length, c.length);
			}
		}
		return "";
	}

	setTarea(){

		let time = this.getDateToday();

		let data = {
			"nombre": this.propertyForm.get('Nombre').value,
			"descripcion": this.propertyForm.get('Descripcion').value,
			"idUser": this.propertyForm.get('idUser').value,
			"idActividad": this.propertyForm.get('idActividad').value,
			"createBy" : this.username,
			"time" : time,
			"status": "En progreso"
		};

		$('#button_create').html("<li class='fa fa-spinner fa-spin fa-1x'> </li>");

		this.service.postUrl('tareas', data)
		.then(response => {
			$('#button_create').html("Crear");
			console.log(response)
			if(response._id !== undefined){
				this.modalReference.close();
				this.getTarea(this.getStatusGlobal);

				this.limpiarInputDescription();
			}
    })
    .catch(data =>{
    		$('#button_create').html("Crear");
        console.log(data.error)
    });
	}

	putTarea(id){

		let time = this.getDateToday();

		let data = {
			"nombre": this.nombrePut,
			"descripcion": this.descripcionPut,
			"idUser": this.idUserPut,
			"idActividad": this.idActividadPut,
			"time" : time,
			"status": this.estado
		};

		$('#button_change').html("<li class='fa fa-spinner fa-spin fa-1x'> </li>");

		this.service.putUrl('tareas/{id}', data, [id])
		.then(response => {
			$('#button_change').html("Cambiar");
			if(response._id !== undefined){
				this.modalReference.close();
				this.getTarea(this.getStatusGlobal);
				this.limpiarInputDescription();
			}
	    })
	    .catch(data =>{
	    		$('#button_change').html("Cambiar");
	        console.log(data.error)
	    });
	}

	changeTarea(id, status){

		let data = {
			"status": status
		};

		this.service.putUrl('tareas/status/{id}', data, [id])
		.then(data => { 
	    	this.getTarea(this.getStatusGlobal); 
	    	this.modalReference2.close();
	    })
	    .catch(data =>{});
	}

	deleteTarea(id){

		this.service.deleteUrl('tareas/{id}', [id])
		.then(data => { 
	    	this.getTarea(this.getStatusGlobal); 
	    	this.modalReference2.close();
	    })
	    .catch(data =>{});
	}

	createForm() {

		this.getActividad();
		this.getUsuario();

	    this.propertyForm = this._formBuilder.group({
	    	Nombre: ['', Validators.required],
	    	Descripcion: ['', Validators.required],
	    	idUser: [null, Validators.required],
	    	idActividad: [null, Validators.required]
	    });
	}

	verTarea(content, data : any){
		this.tarea = data;

		this.getActividadById(this.tarea.idActividad);
		this.getUsuarioById(this.tarea.idUser);

		this.modalReference2 = this.modalService2.open(content, { size: 'lg', centered: true});

		this.modalReference2.result.then((result) => {
		  this.closeResult = `Closed with: ${result}`;
		}, (reason) => {
		  this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
		});
	}

	public moverTipoTarea(status: string = ''){
		this.part = 5;
		this.getTarea(status);
	}

	public masTareas(){
		this.part = this.part + 5;
		this.getTarea(this.getStatusGlobal);
	}

}
