import { Component, OnInit, ElementRef, AfterViewInit, Renderer2} from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../environments/environment';
import { UsersService } from '../../users/users.service';
import { Publicacion } from "../../classes/publicacion";
import { Mensaje } from "../../classes/mensaje";
import { isNullOrUndefined } from 'util';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient , HttpHeaders} from  '@angular/common/http';
import { NgxImageCompressService } from 'ngx-image-compress';
import $ from 'jquery';
import Swal, { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  public propertyForm: FormGroup;
  public closeResult: string;
  public modalReference: any;
  public username : any;
  public idProduct : any;
  public role : any;
  public descriptionPut : any;
  public idPut : any;
  public imagePut : any;
  public mensajes : Mensaje[] = [];
  public usuario : any;
  public producto : any = {};
  public orders : any[] = [];
  public archivo : any = [];
  public part : any = 5;
  public urlPreview : any = '';
  public bload : number = 0;
  public comments: any[] = [];

  //Elementos para actualizar
  public PutNombre : string = "";
  public PutCodigo : number;
  public PutPrecio : number;
  public PutCantidad : number;
  public PutMoneda : any;
  public PutDescripcion : string = "";
  public PutIdCategory : any;

  public tipos : any = [{'id': 1, 'nombre' : 'Pago Movil'}, 
                       {'id': 2, 'nombre' : 'Transacción Bancaria'}, 
                       {'id': 3, 'nombre' : 'Tarjetas de débito y crédito'}]

  public monedas : any = [{'id': 1, 'nombre' : 'USD'}, 
                       {'id': 2, 'nombre' : 'EUR'}, 
                       {'id': 3, 'nombre' : 'GRC'}]
  
  public categorias : any = [{'id': 1, 'nombre' : 'Ropa'}, 
                       {'id': 2, 'nombre' : 'Accesorios'}, 
                       {'id': 3, 'nombre' : 'Mecanica'}]


  constructor(private modalService: NgbModal, private _formBuilder: FormBuilder, 
          private service: UsersService, private router: Router, private route: ActivatedRoute, private  httpClient:  HttpClient,
          private imageCompress: NgxImageCompressService) {
  }

  ngOnInit() {
    this.idProduct = this.route.snapshot.paramMap.get('id');
    this.username = localStorage.getItem('email');
    
    this.role = localStorage.getItem('role');
      
    this.createForm();
    this.getProduct(this.idProduct);
    this.getUser();
  }

  public getUser(){
      this.service.getUrl('user/' + this.username + '/email')
      .then(data => { 
        this.usuario = data;
        console.log(this.usuario);
      })
    .catch(data =>{});
  }

  open(content) {
    this.modalReference = this.modalService.open(content, { size: 'lg', centered: true});

    this.modalReference.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.clickEliminarImagen();
      this.limpiarFormPayment();
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  
	public aprobarOrden(id : any){
		let data = {
			'estado' : 'Aprobado'
		}

		this.service.putUrl('order/{id}/approve', data, [id])
		.then(data => {
			console.log(data);
      this.getOrder();
		})
		.catch(error => {
			console.log(error);
		});
	}

  public createForm() {
      this.propertyForm = this._formBuilder.group({
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

  public emptyField(field : string){
      if(this.propertyForm.get(field).value == '' || this.propertyForm.get(field).value == undefined){
        return true;
      }

      return false;
  }

  openImage(content, id : any, image : any, description : any){
    this.idPut = id;
    this.imagePut = image;
    this.descriptionPut = description;

    this.modalReference = this.modalService.open(content, { size: 'lg', centered: true });

    this.modalReference.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.clickEliminarImagen();
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  public getHeightImagePost(id): any{
      return $('#imagen-post-'+id).height();
  }

  public getWidthImagePost(id): any{
      return $('#imagen-post-'+id).width();
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
        //     this.urlPreview = result;
            
        //     console.warn('Size in bytes after compression:',  this.imageCompress.byteCount(result)/(1024*1024));
        //     // create file from byte
        //     const imageName = fileName;
            
        //     // call method that creates a blob from dataUri
        //     // const imageBlob = this.dataURItoBlob(this.urlPreview.split(',')[1]);

        //     //imageFile created below is the new compressed file which can be send to API in form data
        //     this.archivo = new File([result], imageName, { type: 'image/jpeg' });
        // });

  }

  public clickInsertarImagen(){
    $('#imagen').click();
  }

  public clickInsertarImagenPut(){
    $('#imagenPut').click();
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

  public limpiarFormPayment(){
    this.propertyForm.get('Nombre').setValue("");
    this.propertyForm.get('NumeroIdentificacion').setValue("");
    this.propertyForm.get('NumeroTelefonico').setValue("");
    this.propertyForm.get('NumeroCuenta').setValue("");
    this.propertyForm.get('NombreCuenta').setValue("");
    this.propertyForm.get('idTipoPago').setValue(null);
    this.propertyForm.get('Descripcion').setValue("");
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
    this.service.getUrl('order/{id}/product', [this.producto._id.$oid])
    .then(data => { 
      this.orders = data;
    })
    .catch(data =>{});
  }

  public getComments(){
    this.service.getUrl('comment/{idProduct}/product', [this.producto._id.$oid])
    .then(data => { 
      console.log(data);
      this.comments = data;
    })
    .catch(data =>{
      console.log(data)
    });
  }

  public getProduct(id : any){
    this.bload = 1;

    this.service.getUrl('product/{id}/info', [id])
      .then(data => { 
        console.log(data);
        this.producto = data;

        this.PutNombre = this.producto.nombre;
        this.PutCodigo = this.producto.codigo;
        this.PutCantidad = this.producto.cantidad;
        this.PutMoneda = parseInt(this.producto.moneda);
        this.PutPrecio = this.producto.precio;
        this.PutIdCategory = parseInt(this.producto.idCategory);
        this.PutDescripcion = this.producto.descripcion;
        this.urlPreview = "http://localhost:8080/products/" + this.producto.imagen;

        console.log(this.PutIdCategory)

        this.getOrder();
        this.getComments();
      })
      .catch(data =>{});
  }

  public updateProducto(){
    if(this.archivo.name !== undefined){
        const data = new FormData();
        console.log(this.archivo)
        data.append('archivo', this.archivo);
        data.append('nombre', this.PutNombre);
        data.append('codigo', this.PutCodigo.toString());
        data.append('cantidad', this.PutCantidad.toString());
        data.append('precio', this.PutPrecio.toString());
        data.append('moneda', this.PutMoneda);
        data.append('idCategory', this.PutIdCategory);
        data.append('descripcion', this.PutDescripcion);
        data.append('idUser', this.usuario._id.$oid);
        data.append('estado', 'Disponible');

        console.log("con imagen");

        this.service.putUrlFiles('product/{id}', data, [this.producto._id.$oid])
        .then(response => {
          if(!response.isError){
            this.messageSuccessfully("Se ha actualizado un producto.");
            this.modalReference.close();
            
            this.getProduct(this.idProduct);
          }
        })
        .catch(data =>{
          console.log(data.error)
        });
    }else{
        const data = new FormData();

        data.append('nombre', this.PutNombre);
        data.append('codigo', this.PutCodigo.toString());
        data.append('cantidad', this.PutCantidad.toString());
        data.append('precio', this.PutPrecio.toString());
        data.append('moneda', this.PutMoneda);
        data.append('idCategory', this.PutIdCategory.toString());
        data.append('descripcion', this.PutDescripcion);
        data.append('idUser', this.usuario._id.$oid);
        data.append('estado', 'Disponible');

        this.service.putUrlFiles('productWithoutImage/{id}', data, [this.producto._id.$oid])
        .then(response => {
          if(!response.isError){
            this.messageSuccessfully("Se ha actualizado un producto.");
            this.modalReference.close();
            
            this.getProduct(this.idProduct);
          }
        })
        .catch(data =>{
          console.log(data.error)
        });
    }
	}

  openEdit(content) {
		this.modalReference = this.modalService.open(content, { size: 'lg', centered: true});

		this.modalReference.result.then((result) => {
			this.closeResult = `Closed with: ${result}`;
		}, (reason) => {
			this.clickEliminarImagen();
			this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
		});
	}

  public setPayment(){

    let data = {
      "nombre" : this.propertyForm.get('Nombre').value,
      "identificacion" : this.propertyForm.get('NumeroIdentificacion').value,
      "telefono" : this.propertyForm.get('NumeroTelefonico').value,
      "numero_cuenta" : this.propertyForm.get('NumeroCuenta').value,
      "nombre_cuenta" : this.propertyForm.get('NombreCuenta').value,
      "tipo" : this.propertyForm.get('idTipoPago').value,
      "idUser" : this.usuario._id.$oid,
      "descripcion" : this.propertyForm.get('Descripcion').value
    };

    this.service.postUrl('payment', data)
    .then(response => {

        console.log(response);

        let data2 = {
          "idPayment" : response.id,
          "idUser" : this.usuario._id.$oid,
          "idProduct" : this.producto._id.$oid,
          "comprobante" : this.propertyForm.get('NumeroReferencia').value,
          "estado" : "En progreso"
        }
      
        this.service.postUrl('order', data2)
        .then(response2 => {
          console.log(response2);

          this.messageSuccessfully("¡Su orden de pago ha sido creada exitosamente! \n Estará en revisión y será aprobada por la tienda.");
          this.modalReference.close();
        
        })
        .catch(error => {
          this.errorOcurred("No se ha podido realizar la orden de pago. \n Por favor, verifique su conexión.")
          console.log(error);
        })
        
    })
    .catch(data =>{
      console.log(data)
    });

  }

  public deleteProduct(id){
    this.service.deleteUrl('product/{id}', [id])
    .then(data => { 
        this.getProduct(id); 
      })
    .catch(data =>{});
  }

  // public Gotopost(id, bol: boolean){

  //   if(bol){
  //     localStorage.setItem('commentAut', 'true');
  //     var URL = '/home/post/'+id;
  //     this.router.navigateByUrl(URL);
  //   }else{
  //     localStorage.setItem('commentAut', 'false');
  //     var URL = '/home/post/'+id;
  //     this.router.navigateByUrl(URL);
  //   }
  // }

  public empty(str){
    if(str == null || str == '' || str == undefined || str == "[]" || str.length == 0){
      return true;
    }

    return false;
  }

  private messageSuccessfully($message) {
    let config: SweetAlertOptions = {
      title: $message,
      type: 'success',
      showConfirmButton: false,
      timer: 5500
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

  public deleteProductShow(id: string){

    let config: SweetAlertOptions = {
      title: 'Quieres eliminar este producto?',
      showCancelButton: true,
      type: 'warning',
      confirmButtonText: 'Si',
      cancelButtonText: `No`,
    };

    Swal.fire(config).then((result) => {
      /* Read more about isConfirmed, isDenied below */

      console.log(result)
      
      if(!isNullOrUndefined(result.value)){
        if (result.value) {
          this.deleteProduct(id);
        }
      }else{
        console.log("No")
      }
    });
  
  }

  public comentar(comentario){
    console.log(comentario);

    let data = {
      "idProduct" : this.idProduct,
      "idUser" : this.usuario._id.$oid,
      "descripcion" : comentario,
      "time" : this.getDateToday()
    };

    this.service.postUrl('comment', data)
    .then(response => {
      console.log(response);
      this.getProduct(this.idProduct);
    })
    .catch(data =>{
      console.log(data)
    });
  
  }

}
