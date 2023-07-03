import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilitiesService } from './utilities.service';


@Injectable()
export class WebRestService {

  constructor(public http: HttpClient,
    public servicioUtilidades: UtilitiesService) {

  }

  public async getAsync(url: string, showLoading: boolean = true, msg: string = 'Por favor espere...'): Promise<any> {
    let token = JSON.parse(localStorage.getItem('token')!);
    let headers = null;
    if (token == null) {
      headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'responseType': 'json',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true'
      });
    } else {
      headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'responseType': 'json',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
        'Authorization': 'Bearer ' + token
      });
    }

    let options = { headers: headers };

    let loading: HTMLIonLoadingElement;
    if (showLoading) {
      loading = await this.servicioUtilidades.presentLoading(msg);
    }
    return new Promise(resolve => {
      let subs = this.http.get(url, options).subscribe(data => {
        subs.unsubscribe();
        if (showLoading) {
          loading.dismiss();
        }
        return resolve(data);
      }, err => {
        if (showLoading) {
          loading.dismiss();
        }
        subs.unsubscribe();
        return resolve(<any>err);
      });
    });
  }

  public async postAsync(url: string, objeto: any, showLoading: boolean = true, msg: string = 'Por favor espere...'): Promise<any> {
    let token = JSON.parse(localStorage.getItem('token')!);
    let headers = null;
    if (token == null) {
      headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'responseType': 'json',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true'
      });
    } else {
      headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'responseType': 'json',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
        'Authorization': 'Bearer ' + token
      });
    }

    let options = { headers: headers };

    let loading: HTMLIonLoadingElement;
    if (showLoading) {
      loading = await this.servicioUtilidades.presentLoading(msg);
    }
    return new Promise(resolve => {
      let subs = this.http.post(url, objeto, options ).subscribe(data => {
        subs.unsubscribe();
        if (showLoading) {
          loading.dismiss();
        }
        return resolve(data);
      }, err => {
        subs.unsubscribe();
        if (showLoading) {
          loading.dismiss();
        }
        return resolve(err);
      });
    });
  }

  public deleteAsync(url: string, objeto?: any): Promise<any> {
    let json = objeto ? JSON.stringify(objeto) : null;
    let options = { body: json };
    return new Promise(resolve => {
      let subs = this.http.request("delete", url, options).subscribe(data => {
        subs.unsubscribe();
        return resolve(data);
      }, err => {
        return resolve(null);
      });
    });
  }

  public putAsync(url: string, objeto: any): Promise<any> {
    return new Promise(resolve => {
      let subs = this.http.put(url, objeto).subscribe(data => {
        subs.unsubscribe();
        return resolve(data);
      }, err => {
        subs.unsubscribe();
        return resolve(null);
      });
    });
  }


}

