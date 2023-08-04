import { Component, OnInit } from '@angular/core';
import { UsersService } from '../users/users.service';
import { ActivatedRoute, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Session } from '../core/model/session.model';
import { Usuario } from '../core/model/usuario.model';
import { isNullOrUndefined } from 'util';
import { SweetAlertOptions } from 'sweetalert2';
import Swal from 'sweetalert2';
import $ from 'jquery';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  idUser: string;
  password: string;
  private localStorageService;

  constructor(private router: Router, 
              private _formBuilder: FormBuilder,
              public userService: UsersService) {
    this.localStorageService = localStorage;
  }

  ngOnInit() {

      var rol = localStorage.getItem('role');
      var email = localStorage.getItem('email');
      if (!isNullOrUndefined(rol) && !isNullOrUndefined(email)) {
        this.router.navigate(['/home/option-list'], { replaceUrl: true });
      }
  }

  login() {
    let data;

    if(this.idUser.indexOf('@') !== -1){
      data = {
        "correo": this.idUser,
        "password": this.password,
      };
    }else{
      this.errorOcurred("El correo esta mal escrito.");
    }

    $('#login_button').html("<li class='fa fa-spinner fa-spin fa-1x'> </li>");

    this.userService
      .postUrl('user/email', data)
      .then(response => {

              if(response.correo.length > 0){
                localStorage.setItem('isLoggedIn', "true"); 
                //localStorage.setItem('token', response.token);
                localStorage.setItem('email', response.correo);
                // localStorage.setItem('username', response.usuario.username);
                localStorage.setItem('role', response.role);
                // localStorage.setItem('avatar', response.usuario.avatar);

                $('#login_button').html("Iniciar Sesión");

                this.messageSuccessfully();
              }
              
            })
      .catch(data =>{
              $('#login_button').html("Iniciar Sesión");
              this.errorOcurred(data);
      });
    
  }

  private messageSuccessfully() {
    let config: SweetAlertOptions = {
      title: 'Su sesión se esta iniciando...',
      type: 'success',
      showConfirmButton: false,
      timer: 2500
    };

    Swal.fire(config).then(result => {
      this.router.navigate(['/home/option-list'], { replaceUrl: true });
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
