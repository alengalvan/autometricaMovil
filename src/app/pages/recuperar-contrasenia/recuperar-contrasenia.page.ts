import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { API } from 'src/app/endpoints';
import { WebRestService } from 'src/app/services/crud-rest.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { ModalAlertasCustomPage } from '../modal-alertas-custom/modal-alertas-custom.page';

@Component({
  selector: 'app-recuperar-contrasenia',
  templateUrl: './recuperar-contrasenia.page.html',
  styleUrls: ['./recuperar-contrasenia.page.scss'],
})
export class RecuperarContraseniaPage implements OnInit {

  public form: FormGroup = this.formBuilder.group({
    correo: [null, [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$")]],
  });

  get correo() {
    return this.form.get("correo");
  }

  public mensajesValidacion = {
    correo: [
      { type: "required", message: "*Por favor ingrese su correo electrónico." },
      { type: "pattern", message: "*Por favor ingrese su correo electrónico valido." },
    ]
  };

  constructor(private formBuilder: FormBuilder,
    public utilitiesServices: UtilitiesService,
    public webRestService: WebRestService,
    public modalController: ModalController) { }

  ngOnInit() {
  }

  public async recuperarContrasenia() {
    let objeto = {
      email: this.form.controls['correo'].value
    }

    let respuesta = await this.webRestService.postAsync(API.endpoints.cambiarContrasenia, objeto)
    console.log(respuesta)
    
    if(respuesta.status == true){
      localStorage.setItem("opcionAlerta", "recuperar-contrasenia-enviamos-enlace")
      const modal = await this.modalController.create({
        component: ModalAlertasCustomPage,
        cssClass: 'transparent-modal',
        componentProps: { mensaje: respuesta.message }
      })
      await modal.present();
    }

    if(respuesta.status == 401){
      localStorage.setItem("opcionAlerta", "usuario-inactivo")
      const modal = await this.modalController.create({
        component: ModalAlertasCustomPage,
        cssClass: 'transparent-modal',
        componentProps: { mensaje: respuesta.error.message }
      })
      await modal.present();
    }
    
    if(respuesta.status == 500){
      localStorage.setItem("code", "500")
      const modal = await this.modalController.create({
        component: ModalAlertasCustomPage,
        cssClass: 'transparent-modal',
        componentProps: { mensaje: 'Error inesperado por favor intente más tarde.' }
      })
      await modal.present();
    }
    

  }

}
