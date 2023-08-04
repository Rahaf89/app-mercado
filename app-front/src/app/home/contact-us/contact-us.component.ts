import { Component, OnInit } from '@angular/core';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {

  public bLogger = false;

  constructor() { }

  ngOnInit() {

      var rol = localStorage.getItem('role');
      var email = localStorage.getItem('email');
      
      if (!isNullOrUndefined(rol) && !isNullOrUndefined(email)) {
          this.bLogger = true;
      }
  }

}
