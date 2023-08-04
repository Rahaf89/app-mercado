import { Component, OnInit, ElementRef, AfterViewInit, Renderer2} from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { isNullOrUndefined } from 'util';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { UsersService } from '../users/users.service';
import { Usuario } from "../classes/usuario";
import { Solicitud } from "../classes/solicitud";
import $ from 'jquery';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

	public httpOption : any;
	public username : any;
	public search : any;
	public bLogger = false;
	public myControl = new FormControl();
	public userFilter: Usuario[] = [];
	public usuarios : Usuario[] = []
	public filteredUsers: Observable<Usuario[]>;
	public Usernofound : any;
	public setInterval : any;
	public role : any;
	public notifications : number = 0;
	public solicitudes : Solicitud[] = [];
	public bnotifications : number = 0;

	constructor(private router: Router, private service: UsersService) {}

	ngOnInit() {
	    
	    this.role = localStorage.getItem('role');
	    var email = localStorage.getItem('email');
	    
	    if (!isNullOrUndefined(this.role) && !isNullOrUndefined(email)) {
	      	this.bLogger = true;
	      	this.username = localStorage.getItem('email');
	      	//this.getInvitations();
	      	this.getUser();	
	    }else{
	    	this.router.navigate(['/'], { replaceUrl: true });
	    }

		this.setInterval = setInterval(() => {
				if(this.isWindowDesktop() && this.isWindowMobile()){
					this.displaySearch();
				}
		}, 500);

	}

	public capturaChange(event){

		this.userFilter = [new Usuario('','No hay resultados.','','','','','','','','')];
		this.Usernofound = 0;

		if(event == 'No hay resultados.'){
			$('#search').val('');
		}

		var u = 0;
		for(var i=0; i < this.usuarios.length; i++){
			if((this.usuarios[i].correo.toLowerCase().indexOf(event.toLowerCase()) !== -1 ||
			   this.usuarios[i].nombres.toLowerCase().indexOf(event.toLowerCase()) !== -1 ||
			   this.usuarios[i].apellidos.toLowerCase().indexOf(event.toLowerCase()) !== -1) && event.trim() !== ''){
					this.Usernofound = 1;
					this.userFilter[u] = this.usuarios[i];
					this.userFilter[u].avatar = '/assets/img/perfil-user.jpg';
					u = u + 1;
			}
		}

		this.filteredUsers = this.myControl.valueChanges.pipe(
			startWith(''),
			map(user => user ? this._filter(user) : this.userFilter.slice())
		);

	}

	public getUser(){

		this.service.getUrl('/user')
	  .then(data => { 
			console.log(data);
			this.usuarios = data;
		})
		.catch(data =>{});

	}

	public enableNotifications(){
		if(this.bnotifications == 0){
			this.bnotifications = 1;	

			if(this.notifications > 0){

				this.service.putUrl('solicitudes/showReceipt/1/'+ this.username)
			  .then(data => { 
				  	
				  	this.service.putUrl('solicitudes/showTransmitter/1/'+ this.username)
					  .then(data => { 
								this.getInvitations();
						})
						.catch(data =>{});

				})
				.catch(data =>{});
			
			}

		}else{
			this.bnotifications = 0;
		}
		
	}

	public getInvitations(){
		this.service.getUrl('solicitudes/{idUserReceipt}/user', [this.username])
	  .then(data => { 
				this.solicitudes = data;
				this.notifications = 0;

				for(var i=0; i < this.solicitudes.length; i++){
					if(this.solicitudes[i].showReceipt == 0 && this.solicitudes[i].idUserReceipt == this.username){
							this.notifications = this.notifications + 1;
					}

					if(this.solicitudes[i].showTransmitter == 0 && this.solicitudes[i].idUserTransmitter == this.username){
							this.notifications = this.notifications + 1;
					}
				}
		})
		.catch(data =>{});
	}

	public acceptedInvitations(id : any){

		let data = {
			"accepted" : 1
		}

		this.service.putUrl('solicitudes/{id}/accepted', data, [id])
	  .then(data => { 
				if(data._id !== undefined){
					this.getInvitations();
				}
		})
		.catch(data =>{});
	}

	private _filter(user: string): Usuario[] {
		const filterUser = user.toLowerCase();

		return this.userFilter.filter(user => user.correo.toLowerCase().includes(filterUser));
	}

	public logout(){
		localStorage.removeItem('token');
  	localStorage.removeItem('email');
  	localStorage.removeItem('role');
  	localStorage.removeItem('username');
  	localStorage.removeItem('avatar');
  	localStorage.setItem('isLoggedIn', "false");  

    this.router.navigateByUrl('/login');
	}

	public Gotouser(){
		console.log(this.userFilter.length);
			if(this.search !== 'No hay resultados.' && this.Usernofound == 1){
				this.router.routeReuseStrategy.shouldReuseRoute = () => false;
				this.router.onSameUrlNavigation = 'reload';
				var URL = '/home/profile/'+this.search;
				
				this.router.navigate([URL], { replaceUrl: true });
				this.search = '';
			}else{
				this.search = '';
			}
	}

	public Gotoprofile(){

		var URL = '/home/myprofile/'+localStorage.getItem('email');

		$('#navbarNav').removeClass('show');
		this.router.navigateByUrl(URL);
	}

	public collapseHide(){
			$('#navbarNav').removeClass('show');
	}

	public displaySearch(){
			
			if($('#form-search-mobile').css('display') == 'none'){
					$('#form-search-mobile').css('display', 'block');
			}else{
					$('#form-search-mobile').css('display', 'none');
			}

	}

	public isWindowDesktop(){
			if($('#li-search-desktop').css('display') !== 'none'){
				return true;
			}
				
			return false;
	}

	public isWindowMobile(){
			if($('#form-search-mobile').css('display') !== 'none'){
				return true;
			}
				
			return false;
	}

	ngOnDestroy() {
	  if (this.setInterval) {
	    clearInterval(this.setInterval);
	  }
	}

}