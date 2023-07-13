import { Injectable } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { AlertController, LoadingController, NavController, ToastController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  public sesionActiva$ = new BehaviorSubject<boolean>(JSON.parse(localStorage.getItem('usuario')!) ? true : false);
  sesionActivaObs$ = this.sesionActiva$.asObservable();

  constructor(private navCtrl: NavController,
    private alertCtrl: AlertController,
    private toastController: ToastController,
    private loadingController: LoadingController,
    public alertController: AlertController,

    // private androidPermissions: AndroidPermissions,
    // private uid: Uid
    
    ) {}

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public ngOnInit(){}

  public cerrarSesion(){
    this.sesionActiva$.next(false)
  }

  public iniciarSesion(valor: boolean){
    this.sesionActiva$.next(valor)
  }
  
}
