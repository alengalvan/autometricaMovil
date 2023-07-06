import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, NavController } from '@ionic/angular';
import { API } from 'src/app/endpoints';
import { WebRestService } from 'src/app/services/crud-rest.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { ModalAlertasCustomPage } from '../modal-alertas-custom/modal-alertas-custom.page';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-alta-nueva-tarjeta',
  templateUrl: './alta-nueva-tarjeta.page.html',
  styleUrls: ['./alta-nueva-tarjeta.page.scss'],
})
export class AltaNuevaTarjetaPage implements OnInit {
 public usuario = JSON.parse(localStorage.getItem('usuario')!)
  public tarjetaEditar = JSON.parse(localStorage.getItem('tarjetaEditar')!)
  public formPago: FormGroup = this.formBuilder.group({
    nombreTitular: [null, Validators.required],
    nombreTarjeta: [null,  [Validators.required, Validators.minLength(19), Validators.pattern("[0-9-]+$")]],
    fechaVencimiento: [null, [Validators.required, Validators.minLength(4), Validators.pattern("[0-9/]+$")]],
    cvv: [null,  [Validators.required, Validators.minLength(3), Validators.pattern("[0-9]+$"), Validators.maxLength(4)]],
  });
  public mensajesValidacionPago = {
    nombreTitular: [
      { type: "required", message: "*Ingrese el nombre del titular." },
    ],
    nombreTarjeta: [
      { type: "required", message: "*Ingrese el número de tarjeta." },
      { type: "minlength", message: "*El número de tarjeta debe tener un mínimo de 16 caracteres." },
      { type: "pattern", message: "*El número de tarjeta solo acepta números" },
    ],
    fechaVencimiento: [
      { type: "required", message: "*Ingrese la fecha de vencimiento." },
      { type: "minlength", message: "*La fecha de vencimiento debe tener un mínimo de 7 caracteres." },
      { type: "pattern", message: "*La fecha de vencimiento solo acepta números" },
    ],
    cvv: [
      { type: "required", message: "*Ingrese el CVV." },
      { type: "minlength", message: "*El cvv debe tener un mínimo de 3 caracteres." },
      { type: "maxlength", message: "*El cvv debe tener un máximo de 4 caracteres." },
      { type: "pattern", message: "*El cvv solo acepta números" },
    ]
  };
  public id = this.route.snapshot.paramMap.get('id');

  get nombreTitular() {
    return this.formPago.get("nombreTitular");
  }
  get nombreTarjeta() {
    return this.formPago.get("nombreTarjeta");
  }
  get fechaVencimiento() {
    return this.formPago.get("fechaVencimiento");
  }
  get cvv() {
    return this.formPago.get("cvv");
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  constructor(private navCtrl: NavController,
    private formBuilder: FormBuilder,
    public utilitiesServices: UtilitiesService,
    public webRestService: WebRestService,
    public modalController: ModalController,
    private route: ActivatedRoute) { }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async ngOnInit() {
    console.log(this.id)
    if(this.id){
      this.setearEdicion();
    }
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  
  public regresar() {
    this.navCtrl.navigateRoot("administracion-tarjetas")
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  
  public async altaTarjeta() {
    if(!this.formPago.valid){
      this.utilitiesServices.validaCamposFormulario([this.formPago]);
      return;
    }
    
    let tarjeta = this.formPago.controls['nombreTarjeta'].value.split("-").join('');
    
    let objeto = {
      name: this.formPago.controls['nombreTitular'].value,
      number_card: tarjeta,
      cvv2: this.formPago.controls['cvv'].value,
      month_expiration: this.formPago.controls['fechaVencimiento'].value.split("/")[0],
      year_expiration: this.formPago.controls['fechaVencimiento'].value.split("/")[1],
      id_client: this.usuario.id,
    }

    let respuesta = await this.webRestService.postAsync(API.endpoints.agregarTarjeta, objeto);

    if (respuesta.status == true) {
      localStorage.setItem("opcionAlerta", "registro-tarjeta-exitoso")
      const modal = await this.modalController.create({
        component: ModalAlertasCustomPage,
        cssClass: 'transparent-modal',
        componentProps: { mensaje: respuesta.message }
      })
      await modal.present();
      this.navCtrl.navigateRoot("administracion-tarjetas")
    }

    if (respuesta.status == false || respuesta.status == 401) {
      localStorage.setItem("opcionAlerta", "registro-tarjeta-fallido")
      const modal = await this.modalController.create({
        component: ModalAlertasCustomPage,
        cssClass: 'transparent-modal',
        componentProps: { mensaje: "Error inesperado, por favor intente más tarde." }
      })
      await modal.present();
    }
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  
  public async edicionTarjeta() {

    if(!this.formPago.valid){
      this.utilitiesServices.validaCamposFormulario([this.formPago]);
      return;
    }
    console.log(this.formPago)
    let tarjeta = this.formPago.controls['nombreTarjeta'].value.split("-").join('');
    let objeto = {
      name: this.formPago.controls['nombreTitular'].value,
      number_card: tarjeta,
      cvv2: this.formPago.controls['cvv'].value,
      month_expiration: this.formPago.controls['fechaVencimiento'].value.split("/")[0],
      year_expiration: this.formPago.controls['fechaVencimiento'].value.split("/")[1],
      id_client: this.usuario.id,
      id_card: this.tarjetaEditar.id
    }

    let respuesta = await this.webRestService.postAsync(API.endpoints.editarTarjeta, objeto);
    console.log(respuesta)

    if (respuesta.status == true) {
      localStorage.setItem("opcionAlerta", "registro-tarjeta-exitoso")
      const modal = await this.modalController.create({
        component: ModalAlertasCustomPage,
        cssClass: 'transparent-modal',
        componentProps: { mensaje: respuesta.message }
      })
      await modal.present();
      this.navCtrl.navigateRoot("administracion-tarjetas")
    }

    if (respuesta.status == false || respuesta.status == 401) {
      localStorage.setItem("opcionAlerta", "registro-tarjeta-fallido")
      const modal = await this.modalController.create({
        component: ModalAlertasCustomPage,
        cssClass: 'transparent-modal',
        componentProps: { mensaje: "Error inesperado, por favor intente más tarde." }
      })
      await modal.present();
    }
  }

  public async setearEdicion(){
    console.log(this.tarjetaEditar)

    let tarjeta = this.tarjetaEditar.card_number.match(/.{1,4}/g);


    this.formPago.controls['nombreTitular'].setValue(this.tarjetaEditar.holder_name);
    this.formPago.controls['nombreTarjeta'].setValue(tarjeta.join("-"));
    this.formPago.controls['fechaVencimiento'].setValue(this.tarjetaEditar.expiration_month + "/" + this.tarjetaEditar.expiration_year);
  }
 
  public prueba(){
    console.log(this.nombreTarjeta)
  }

}
