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
  selector: 'app-myproducts',
  templateUrl: './myproducts.component.html',
  styleUrls: ['./myproducts.component.css']
})
export class MyProductsComponent implements OnInit {

  public propertyForm: FormGroup;
  public closeResult: string;
  public modalReference: any;
  public username : any;
  public idProduct : any;
  public role : any;
  public orders : any[] = [];
  public products : any[] = [];
  public usuario : any;

	public monedas : any = [{'id': 1, 'nombre' : 'USD'}, 
							   {'id': 2, 'nombre' : 'EUR'}, 
							   {'id': 3, 'nombre' : 'GRC'}]

  constructor(private modalService: NgbModal, private _formBuilder: FormBuilder, 
    private service: UsersService, private router: Router, private route: ActivatedRoute, private  httpClient:  HttpClient) { }

  ngOnInit() {
    this.idProduct = this.route.snapshot.paramMap.get('id');
    this.username = localStorage.getItem('email');
    this.role = localStorage.getItem('role');

    this.getUser();
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
        this.getMyProducts();
      })
    .catch(data =>{});
  }

  getMyProducts(){
    this.service.getUrl('order/'+this.usuario._id.$oid+'/user')
    .then(data => {
      this.orders = data;
      this.getProducts();
    })
    .catch(error => {
      console.log(error);
    });
  }

  public getNameProduct(idProduct : any){
    for (let index = 0; index < this.products.length; index++) {
      if(this.products[index]._id.$oid == idProduct){
        return this.products[index].nombre;
      }
    }
  }

  public getAmountProduct(idProduct : any){
    for (let index = 0; index < this.products.length; index++) {
      if(this.products[index]._id.$oid == idProduct){
        return this.products[index].precio + ' ' + this.checkMoneda(this.products[index].moneda);
      }
    }
  }

  public getProducts(){
    this.service.getUrl('product')
     .then(data => { 
      console.log(data)
       this.products = data;
     })
   .catch(data =>{});
  }

}
