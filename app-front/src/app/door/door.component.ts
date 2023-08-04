import { Component, OnInit, ElementRef, AfterViewInit, Renderer2} from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlertOptions } from 'sweetalert2';
import Swal from 'sweetalert2';
import { isNullOrUndefined } from 'util';
import { Router } from '@angular/router';
import $ from 'jquery';

@Component({
  selector: 'app-door',
  templateUrl: './door.component.html',
  styleUrls: ['./door.component.css']
})
export class DoorComponent implements OnInit {
  public httpOption : any;
	public username : any;
	public bLogger = false;
	public role : any;

  constructor(private router: Router) {}

  ngOnInit() {
    var rol = localStorage.getItem('role');
	  var email = localStorage.getItem('email');

    if (!isNullOrUndefined(rol) && !isNullOrUndefined(email)) {
      this.bLogger = true;
      this.username = localStorage.getItem('email');
    }
  }

  public Gotologin(){
    this.router.navigate(['/login'], { replaceUrl: true });
  }

  public Gotoregister(){
    this.router.navigate(['/register'], { replaceUrl: true });
  }

  public Gotohome(){
    this.router.navigate(['/home/option-list'], { replaceUrl: true });
  }

  public collapseHide(){
      $('#navbarNav').removeClass('show');
  }

}
