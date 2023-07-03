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
    nombreTarjeta: [null, Validators.required],
    fechaVencimiento: [null, Validators.required],
    cvv: [null, Validators.required],
  });
  public mensajesValidacionPago = {
    nombreTitular: [
      { type: "required", message: "*Ingrese el nombre del titular." },
    ],
    nombreTarjeta: [
      { type: "required", message: "*Ingrese el número de tarjeta." },
    ],
    fechaVencimiento: [
      { type: "required", message: "*Ingrese la fecha de vencimiento." },
    ],
    cvv: [
      { type: "required", message: "*Ingrese el CVV." },
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
    console.log(this.formPago)

    let objeto = {
      name: this.formPago.controls['nombreTitular'].value,
      number_card: this.formPago.controls['nombreTarjeta'].value,
      cvv2: this.formPago.controls['cvv'].value,
      month_expiration: this.formPago.controls['fechaVencimiento'].value.substring(0, 2),
      year_expiration: this.formPago.controls['fechaVencimiento'].value.substring(2, 4),
      id_client: this.usuario.id,
    }

    console.log(objeto)

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

    if (respuesta.status == false) {
      localStorage.setItem("opcionAlerta", "registro-tarjeta-fallido")
      const modal = await this.modalController.create({
        component: ModalAlertasCustomPage,
        cssClass: 'transparent-modal',
        componentProps: { mensaje: "No se pudo guardar la tarjeta." }
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

    let objeto = {
      name: this.formPago.controls['nombreTitular'].value,
      number_card: this.formPago.controls['nombreTarjeta'].value,
      cvv2: this.formPago.controls['cvv'].value,
      month_expiration: this.formPago.controls['fechaVencimiento'].value.substring(0, 2),
      year_expiration: this.formPago.controls['fechaVencimiento'].value.substring(2, 4),
      id_client: this.usuario.id,
      id_card: this.tarjetaEditar.id
    }

    console.log(objeto)

    let respuesta = await this.webRestService.postAsync(API.endpoints.editarTarjeta, objeto);

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

    if (respuesta.status == false) {
      localStorage.setItem("opcionAlerta", "registro-tarjeta-fallido")
      const modal = await this.modalController.create({
        component: ModalAlertasCustomPage,
        cssClass: 'transparent-modal',
        componentProps: { mensaje: this.id? "No se pudo editar la tarjeta." : "No se pudo guardar la tarjeta." }
      })
      await modal.present();
    }
  }

  public async setearEdicion(){
    console.log(this.tarjetaEditar)
    this.formPago.controls['nombreTitular'].setValue(this.tarjetaEditar.holder_name);
    this.formPago.controls['nombreTarjeta'].setValue(this.tarjetaEditar.card_number);
    this.formPago.controls['fechaVencimiento'].setValue(this.tarjetaEditar.expiration_month + this.tarjetaEditar.expiration_year);
  }

}
