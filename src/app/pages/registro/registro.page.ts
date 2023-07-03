import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonInput, ModalController, NavController } from '@ionic/angular';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { ModalTerminosCondicionesPage } from '../modal-terminos-condiciones/modal-terminos-condiciones.page';
import { WebRestService } from 'src/app/services/crud-rest.service';
import { API } from 'src/app/endpoints';
import { ModalAlertasCustomPage } from '../modal-alertas-custom/modal-alertas-custom.page';
import { Network, ConnectionStatus } from '@capacitor/network'

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  @ViewChild('inputPassword', { static: false })
  inputPassword!: IonInput;
  public verContrasena: boolean = false;
  @ViewChild('inputPasswordConfirm', { static: false })
  inputPasswordConfirm!: IonInput;
  public verContrasenaConfirm: boolean = false;
  public regexContrasenia = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){8,20}$/;
  public contraseniaComparacionValida: boolean = false;
  public form: FormGroup = this.formBuilder.group({
    nombre: [null, Validators.required],
    apellidoPaterno: [null, Validators.required],
    apellidoMaterno: [null, Validators.required],
    estado: [null, Validators.required],
    correo: [null, [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$")]],
    telefono: [null, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")],
    contrasenia: [null, [Validators.required, Validators.pattern(this.regexContrasenia)]],
    confirmacionContrasenia: [null, Validators.required],
    heLeidoTerminosCondiciones: [false, Validators.pattern('true')]
  });
  public networkStatus: ConnectionStatus | undefined ;

  public estados: any = [];

  get nombre() {
    return this.form.get("nombre");
  }

  get apellidoPaterno() {
    return this.form.get("apellidoPaterno");
  }

  get apellidoMaterno() {
    return this.form.get("apellidoMaterno");
  }

  get estado() {
    return this.form.get("estado");
  }

  get correo() {
    return this.form.get("correo");
  }

  get telefono() {
    return this.form.get("telefono");
  }

  get contrasenia() {
    return this.form.get("contrasenia");
  }

  get confirmacionContrasenia() {
    return this.form.get("confirmacionContrasenia");
  }

  get heLeidoTerminosCondiciones() {
    return this.form.get("heLeidoTerminosCondiciones");
  }

  public mensajesValidacion = {
    nombre: [
      { type: "required", message: "*Por favor ingrese su nombre." },
    ],
    apellidoPaterno: [
      { type: "required", message: "*Por favor ingrese su primer apellido." },
    ],
    apellidoMaterno: [
      { type: "required", message: "*Por favor ingrese su segundo apellido." },
    ],
    estado: [
      { type: "required", message: "*Es necesario que seleccione un estado." },
    ],
    correo: [
      { type: "required", message: "*Por favor ingrese su correo electrónico." },
      { type: "pattern", message: "*Correo electrónico no valido." },
    ],
    telefono: [
      { type: "pattern", message: "*El número de teléfono debe tener 10 caracteres." },
    ],
    contrasenia: [
      { type: "required", message: "*Por favor ingrese su correo electrónico." },
      { type: "pattern", message: "*La contraseña debe tener al menos 8 caracteres, un número, un carácter especial, una letra mayúscula y letras minúsculas." },

    ],
    confirmacionContrasenia: [
      { type: "required", message: "*Por favor ingrese su contraseña." },
    ],
    heLeidoTerminosCondiciones: [
      { type: "pattern", message: "*Debe aceptar los Términos y Condiciones y el Aviso de Privacidad para registrarse." },
    ]
  };

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  constructor(private formBuilder: FormBuilder,
    public utilitiesService: UtilitiesService,
    public modalController: ModalController,
    public webService: WebRestService,
    private navCtrl: NavController) { }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async ngOnInit() {

    if(Network){
      Network.getStatus().then((status) => {
        this.networkStatus = status
      })
    }

    Network.addListener("networkStatusChange", status => {
      this.networkStatus = status
    })

    this.estados = await this.utilitiesService.obtenerEstadosRepublica();
    this.form.controls['confirmacionContrasenia'].valueChanges.subscribe(value => {
      console.log(value);
      if (value == this.form.controls['contrasenia'].value) {
        this.contraseniaComparacionValida = true;
      } else {
        this.contraseniaComparacionValida = false;
      }
    });

    this.form.controls['contrasenia'].valueChanges.subscribe(value => {
      console.log(value);
      if (value == this.form.controls['confirmacionContrasenia'].value) {
        this.contraseniaComparacionValida = true;
      } else {
        this.contraseniaComparacionValida = false;
      }
    });
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public mostrarContrasena(esConfirmacion?: boolean) {
    if (esConfirmacion) {
      if (this.verContrasenaConfirm) this.verContrasenaConfirm = false;
      else this.verContrasenaConfirm = true;
      this.inputPasswordConfirm.type = this.verContrasenaConfirm ? 'text' : 'password';
      this.inputPasswordConfirm.autofocus;
    } else {
      if (this.verContrasena) this.verContrasena = false;
      else this.verContrasena = true;
      this.inputPassword.type = this.verContrasena ? 'text' : 'password';
      this.inputPassword.autofocus;
    }
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async registrar() {

    if (!this.form.valid) {
      this.utilitiesService.validaCamposFormulario([this.form]);
      return
    }

    let objeto: any = {
      name: this.form.controls['nombre'].value,
      last_name: this.form.controls['apellidoPaterno'].value,
      last_name_mother: this.form.controls['apellidoMaterno'].value,
      phone: this.form.controls['telefono'].value,
      state: this.form.controls['estado'].value,
      email: this.form.controls['correo'].value,
      password: this.form.controls['contrasenia'].value
    }

    let respuesta = await this.webService.postAsync(API.endpoints.registro, objeto)
    console.log(respuesta)
    if (respuesta.status == 401 && respuesta.error.message.includes('anterioridad')) {
      localStorage.setItem("opcionAlerta", "recuperar-contrasenia-enviamos-enlace")
      const modal = await this.modalController.create({
        component: ModalAlertasCustomPage,
        cssClass: 'transparent-modal',
        componentProps: { mensaje: respuesta.error.message }
      })
      await modal.present();
      return;
    }

    if (respuesta.status == 401) {
      await this.openAlerta(respuesta.error.message)
      return;
    }

    if (respuesta.status == 500) {
      await this.openAlerta('Error inesperado por favor intente más tarde.')
      return;
    }

    if (respuesta.status == true) {
      localStorage.setItem("opcionPopup", "1")
      localStorage.setItem("mensajePopup", respuesta.message)
      this.navCtrl.navigateRoot("poppups");
    }
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async openTrasnparentModal(esTerminos: boolean) {
    localStorage.setItem("abrirTerminos", esTerminos ? "1" : "2");
    const modal = await this.modalController.create({
      component: ModalTerminosCondicionesPage,
      cssClass: 'transparent-modal',
    })
    await modal.present();
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  prueba(algo: any) {
    console.log(algo)
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async openAlerta(data: any) {
    localStorage.setItem("opcionAlerta", "usuario-inactivo")
    const modal = await this.modalController.create({
      component: ModalAlertasCustomPage,
      cssClass: 'transparent-modal',
      componentProps: { mensaje: data }
    })
    await modal.present();
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public revisarInternet(){

  }

}
