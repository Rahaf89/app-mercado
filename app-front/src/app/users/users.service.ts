// src/app/users/users.service.ts

import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'https://localhost:4200' })
};

@Injectable({
  providedIn: "root"
})
export class UsersService {

  private apiUrl = environment.apiUrl;
  private myInit = {
  };

  constructor(private http: HttpClient) {}

  // login(user: any): Observable<any> {
  //   return this.http.post("https://reqres.in/api/login", user);
  // }

  /*******************************************************
  * Metodo para realizar el consumo del API de tipo GET  *
  ********************************************************/
  public getUrl(url: string, parameter?: Array<string>): Promise<any> {
    // Cuando la URL contiene uno o más parametros, sustituirlos por los elementos del arreglo parameter
    if (parameter && url && url.indexOf('{') !== -1) {
      parameter.forEach(p => {
        url = url.replace(/{[a-zA-Z_]*}/, p);
      });
    }
    
    return <Promise<any>>this.http.get(this.apiUrl + url).toPromise();
  }

  /*******************************************************
  * Metodo para realizar el consumo del API de tipo POST *
  ********************************************************/
  public postUrl(url, data, parameter?: Array<string>): Promise<any> {
    
    // Cuando la URL contiene uno o más parametros, sustituirlos por los elementos del arreglo parameter
    if (parameter && url && url.indexOf('{') !== -1) {
      parameter.forEach(p => {
        url = url.replace(/{[a-zA-Z_]*}/, p);
      });
    }

    this.myInit['body'] = data;
    return <Promise<any>>(
      this.http.post(this.apiUrl + url, this.myInit['body'], httpOptions).toPromise()
    );
  }

  /**********************************************************
  * Metodo para realizar el consumo del API de tipo POST Files *
  ***********************************************************/
  public postUrlFiles(url: string, data: any, parameter?: Array<string>): Promise<any> {
  
    // Cuando la URL contiene uno o más parametros, sustituirlos por los elementos del arreglo parameter
    if (parameter && url && url.indexOf('{') !== -1) {
      parameter.forEach(p => {
        url = url.replace(/{[a-zA-Z_]*}/, p);
      });
    }

    this.myInit['body'] = data;
    return <Promise<any>>(
      this.http.post(this.apiUrl + url, this.myInit['body']).toPromise()
    );
  }

  /*******************************************************
  * Metodo para realizar el consumo del API de tipo PUT  *
  ********************************************************/
  public putUrl(url, data?, parameter?: Array<string>): Promise<any> {
    // Cuando la URL contiene uno o más parametros, sustituirlos por los elementos del arreglo parameter
    if (parameter && url && url.indexOf('{') !== -1) {
      parameter.forEach(p => {
        url = url.replace(/{[a-zA-Z_]*}/, p);
      });
    }

    this.myInit['body'] = data;
    return <Promise<any>>(
      this.http.put(this.apiUrl + url, this.myInit['body'], httpOptions).toPromise()
    );
  }
  
  /*******************************************************
  * Metodo para realizar el consumo del API de tipo PUT Files  *
  ********************************************************/
  public putUrlFiles(url: string, data: any, parameter?: Array<string>): Promise<any> {
    // Cuando la URL contiene uno o más parametros, sustituirlos por los elementos del arreglo parameter
    if (parameter && url && url.indexOf('{') !== -1) {
      parameter.forEach(p => {
        url = url.replace(/{[a-zA-Z_]*}/, p);
      });
    }

    this.myInit['body'] = data;
    return <Promise<any>>(
      this.http.put(this.apiUrl + url, this.myInit['body']).toPromise()
    );
  }

  /**********************************************************
  * Metodo para realizar el consumo del API de tipo DELETE  *
  ***********************************************************/
  public deleteUrl(url, parameter?: Array<string>): Promise<any> {
    // Cuando la URL contiene uno o más parametros, sustituirlos por los elementos del arreglo parameter
    if (parameter && url && url.indexOf('{') !== -1) {
      parameter.forEach(p => {
        url = url.replace(/{[a-zA-Z_]*}/, p);
      });
    }

    return <Promise<any>>(
      this.http.delete(this.apiUrl + url).toPromise()
    );
  }
}