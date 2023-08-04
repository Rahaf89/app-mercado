import { Component, OnInit, ElementRef, AfterViewInit, Renderer2} from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { isNullOrUndefined } from 'util';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { UsersService } from '../../users/users.service';
import { Usuario } from "../../classes/usuario";
import $ from 'jquery';
import { NgxImageCompressService } from 'ngx-image-compress';
import Swal, { SweetAlertOptions } from 'sweetalert2';


@Component({
  selector: 'app-option-list',
  templateUrl: './option-list.component.html',
  styleUrls: ['./option-list.component.css']
})
export class OptionListComponent implements OnInit {

	public propertyForm: FormGroup;
	public propertyForm2: FormGroup;
  	public httpOption : any;
	public username : any;
	public usuario : any;
	public products : any;
	public productsSelected : any[] = [];
	public usuarios : Usuario[] = [];
	public urlPreview : any = '';
	public archivo : any = [];
	public modalReference: any;
	public closeResult: string;
	public bLogger = false;
	public bSelect = false;
	public arregloIdsProducts : any[] = [];
	public role : any;
	public recomendaciones : any[] = [];
	public recomendacionesAgregadas : any[] = [];

	public monedas : any = [{'id': 1, 'nombre' : 'USD'}, 
							   {'id': 2, 'nombre' : 'EUR'}, 
							   {'id': 3, 'nombre' : 'GRC'}]
	public categorias : any = [{'id': 1, 'nombre' : 'Ropa'}, 
							   {'id': 2, 'nombre' : 'Accesorios'}, 
							   {'id': 3, 'nombre' : 'Mecanica'}]
	public tipos : any = [{'id': 1, 'nombre' : 'Pago Movil'}, 
							   {'id': 2, 'nombre' : 'Transacción Bancaria'}, 
							   {'id': 3, 'nombre' : 'Tarjetas de débito y crédito'}]

  constructor(private modalService: NgbModal, private router: Router, private service: UsersService, private _formBuilder: FormBuilder, private _formBuilder2: FormBuilder,
	private imageCompress: NgxImageCompressService) { }

	ngOnInit() { 
		this.role = localStorage.getItem('role');
		this.getProducts();
		this.createForm();
		this.createFormPayment();
	}

	public clickEnableSelect(){
		this.bSelect = true;
	}

	public clickDisableSelect(){
		this.bSelect = false;
	}

	public checkMoneda(id : any){
		for (let index = 0; index < this.monedas.length; index++) {
			if(this.monedas[index].id == id){
				return this.monedas[index].nombre;
			}
		}
	}

	public getUser(){
		this.service.getUrl('user/' + this.username + '/email')
		.then(data => { 
		  this.usuario = data;
		  console.log(this.usuario);
		})
	  .catch(data =>{});
	}

	public getRecomendaciones(producto: string){
		this.service.getUrl('recomendaciones/{productoInicial}',[producto])
		.then(data => { 
			console.log(data.respuesta);
			var keys=Object.keys(data.respuesta)
			for (var i=0;i<keys.length;i++){
				if(this.recomendacionesAgregadas.indexOf(keys[i])== -1){
					this.recomendacionesAgregadas.push(keys[i])
					this.getProduct(keys[i])
				}
					
			} 
		})
	  .catch(data =>{});
	}

	public addIdsProducts(id : string, event){
		if(event.target.checked){
			this.getRecomendaciones(id);
			this.arregloIdsProducts.push(id);
		}else{
			for (let index = 0; index < this.arregloIdsProducts.length; index++) {
				if(this.arregloIdsProducts[index] == id){
					this.arregloIdsProducts.splice(index, 1);
				}
			}
		}

		console.log(this.arregloIdsProducts);
	}

	public openPayment(content) {
		this.addShoppingCart();
		if(this.productsSelected.length > 0){
			this.modalReference = this.modalService.open(content, { size: 'lg', centered: true});
		
			this.modalReference.result.then((result) => {
			this.closeResult = `Closed with: ${result}`;
			}, (reason) => {
			this.clickEliminarImagen();
			this.limpiarFormPayment();
			this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
			});
		}
	}

	public setPayment(){

		let data = {
		  "nombre" : this.propertyForm2.get('Nombre').value,
		  "identificacion" : this.propertyForm2.get('NumeroIdentificacion').value,
		  "telefono" : this.propertyForm2.get('NumeroTelefonico').value,
		  "numero_cuenta" : this.propertyForm2.get('NumeroCuenta').value,
		  "nombre_cuenta" : this.propertyForm2.get('NombreCuenta').value,
		  "tipo" : this.propertyForm2.get('idTipoPago').value,
		  "idUser" : this.usuario._id.$oid,
		  "descripcion" : this.propertyForm2.get('Descripcion').value
		};
		this.service.postUrl('grafo', {"productos":JSON.stringify(this.productsSelected)}).then(response => {
			console.log(response);
		})
		.catch(data =>{

		});

		for (let index = 0; index < this.productsSelected.length; index++) {
			this.service.postUrl('payment', data)
			.then(response => {
		
				console.log(response);
		
				let data2 = {
				"idPayment" : response.id,
				"idUser" : this.usuario._id.$oid,
				"idProduct" : this.productsSelected[index]._id.$oid,
				"comprobante" : this.propertyForm2.get('NumeroReferencia').value,
				"estado" : "En progreso"
				}
			
				this.service.postUrl('order', data2)
				.then(response2 => {
					console.log(response2);

					if(index == this.productsSelected.length - 1){
						this.messageSuccessfully("¡Su orden de pago ha sido creada exitosamente! \n Estará en revisión y será aprobada por la tienda.");
						this.modalReference.close();
						this.limpiarFormPayment();
					}
				})
				.catch(error => {
					this.errorOcurred("No se ha podido realizar la orden de pago. \n Por favor, verifique su conexión.")
					console.log(error);
				});
			})
			.catch(data =>{
			console.log(data)
			});
		}
	
	}

	public limpiarFormPayment(){
		this.propertyForm2.get('Nombre').setValue("");
		this.propertyForm2.get('NumeroIdentificacion').setValue("");
		this.propertyForm2.get('NumeroTelefonico').setValue("");
		this.propertyForm2.get('NumeroCuenta').setValue("");
		this.propertyForm2.get('NombreCuenta').setValue("");
		this.propertyForm2.get('idTipoPago').setValue(null);
		this.propertyForm2.get('Descripcion').setValue("");

		this.productsSelected = [];
		this.arregloIdsProducts = [];
		$('.form-check-input').prop('checked', false);
	}

	public addShoppingCart(){
		for (let index = 0; index < this.products.length; index++) {
			if(this.arregloIdsProducts.includes(this.products[index]._id.$oid)){
				this.productsSelected.push(this.products[index]);
			}
		}
	}

	public amountFacture(){
		var amount = 0;
		for (let index = 0; index < this.productsSelected.length; index++) {
			amount = amount + parseInt(this.productsSelected[index].precio);
		}

		return amount;
	}

	public emptyField(field : string){
		if(this.propertyForm2.get(field).value == '' || this.propertyForm2.get(field).value == undefined){
		  return true;
		}
  
		return false;
	}

  	public Gotoprofile(){
		var URL = '/home/myprofile/'+localStorage.getItem('email');
		$('#navbarNav').removeClass('show');
		this.router.navigateByUrl(URL);
	}

	public getProducts(){
		   this.service.getUrl('product')
	    	.then(data => { 
					this.products = data;		
					this.username = localStorage.getItem('email');

					this.getUser();
				})
			.catch(data =>{});
	}

	public getProduct(id){
		console.log(this.products.find(x => x._id.$oid == id));
		this.recomendaciones.push(this.products.find(x => x._id.$oid == id))
 	}
	
	public createForm() {
	    this.propertyForm = this._formBuilder.group({
	    	Nombre: ['', Validators.required],
	    	Codigo: ['', Validators.required],
	    	Precio: ['', Validators.required],
			Cantidad: ['', Validators.required],
	    	idMoneda: [null, Validators.required],
			idCategoria: [null, Validators.required],
			Descripcion: [''],
	    });
	}

	public createFormPayment() {
		this.propertyForm2 = this._formBuilder2.group({
		  Nombre: [''],
		  NumeroIdentificacion: ['', Validators.required],
		  NumeroTelefonico: ['', Validators.required],
		  NumeroCuenta: ['', Validators.required],
		  NumeroReferencia: ['', Validators.required],
		  NombreCuenta: [''],
		  idTipoPago: [null, Validators.required],
		  Descripcion: [''],
		});
	}

	public addProducto(){

		const data = new FormData();
		console.log(this.archivo)
		data.append('archivo', this.archivo);
		data.append('nombre', this.propertyForm.get('Nombre').value);
		data.append('codigo', this.propertyForm.get('Codigo').value);
		data.append('precio', this.propertyForm.get('Precio').value);
		data.append('cantidad', this.propertyForm.get('Cantidad').value);
		data.append('moneda', this.propertyForm.get('idMoneda').value);
		data.append('idCategory', this.propertyForm.get('idCategoria').value);
		data.append('descripcion', this.propertyForm.get('Descripcion').value);
		data.append('idUser', 'Jose Barrientos');
		data.append('estado', 'Disponible');

		this.service.postUrlFiles('product', data)
		.then(response => {
			if(!response.isError){
				this.messageSuccessfully("Se ha creado una publicación.");
				this.modalReference.close();
				
				this.getProducts();
				this.limpiarInputDescription();
			}
		})
		.catch(data =>{
		console.log(data.error)
		});
	}

	public clickInsertarImagen(){
		$('#imagen').click();
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
			//this.compressFile(this.urlPreview, fileName)
		  }
	
		  reader.readAsDataURL(event.target.files[0]);
		}
	}
	
	public compressFile(image, fileName) {
		// var orientation = -1;

		// console.warn('Size in bytes is now:',  this.imageCompress.byteCount(image)/(1024*1024));
		
		// this.imageCompress.compressFile(image, orientation, 50, 50).then(
		// result => {
		// 	this.urlPreview = result;
			
		// 	console.warn('Size in bytes after compression:',  this.imageCompress.byteCount(result)/(1024*1024));
		// 	// create file from byte
		// 	const imageName = fileName;
			
		// 	// call method that creates a blob from dataUri
		// 	// const imageBlob = this.dataURItoBlob(this.urlPreview.split(',')[1]);

		// 	//imageFile created below is the new compressed file which can be send to API in form data
		// 	this.archivo = new File([result], imageName, { type: 'image/jpeg' });
		// });

	}

	open(content, imagen : any) {
		if(imagen !== undefined && imagen !== ''){
			this.urlPreview = imagen;
		}

		this.modalReference = this.modalService.open(content, { size: 'lg', centered: true});

		this.modalReference.result.then((result) => {
			this.closeResult = `Closed with: ${result}`;
		}, (reason) => {
			this.clickEliminarImagen();
			this.limpiarInputDescription();
			this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
		});
	}

	public clickEliminarImagen(){
		var inputImage = <HTMLInputElement> document.getElementById('imagen');
		var inputImagePut = <HTMLInputElement> document.getElementById('imagenPut');
  
		if(inputImage !== null){
			 inputImage.value = '';
		}	
  
		if(inputImagePut !== null){
			 inputImagePut.value = '';
		}
  
		this.archivo = [];
		this.urlPreview = '';
	}
	
	public limpiarInputDescription(){
		this.propertyForm.get('Descripcion').setValue("");
		this.propertyForm.get('Nombre').setValue("");
		this.propertyForm.get('Codigo').setValue("");
		this.propertyForm.get('Precio').setValue("");
		this.propertyForm.get('idMoneda').setValue(null);
		this.propertyForm.get('idCategoria').setValue(null);
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

	private messageSuccessfully($message) {
		let config: SweetAlertOptions = {
		  title: $message,
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

}
