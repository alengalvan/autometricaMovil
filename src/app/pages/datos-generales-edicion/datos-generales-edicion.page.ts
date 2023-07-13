import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonInput, ModalController, NavController } from '@ionic/angular';
import { API } from 'src/app/endpoints';
import { WebRestService } from 'src/app/services/crud-rest.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { ModalAlertasCustomPage } from '../modal-alertas-custom/modal-alertas-custom.page';

@Component({
  selector: 'app-datos-generales-edicion',
  templateUrl: './datos-generales-edicion.page.html',
  styleUrls: ['./datos-generales-edicion.page.scss'],
})
export class DatosGeneralesEdicionPage implements OnInit {
  public usuario = JSON.parse(localStorage.getItem('usuario')!);
  public datosPersonales = JSON.parse(localStorage.getItem('datosPersonales')!);

  @ViewChild('inputPassword', { static: false })
  inputPassword!: IonInput;
  public verContrasena: boolean = false;
  @ViewChild('inputPasswordConfirm', { static: false })
  inputPasswordConfirm!: IonInput;
  public verContrasenaConfirm: boolean = false;
  public regexContrasenia = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?#"'(/.:;+&_-])([A-Za-z\d$@$!%*?#"'(/.:;+&_-]|[^ ]){8,20}$/;
  public contraseniaComparacionValida: boolean = false;

  public form: FormGroup = this.formBuilder.group({
    nombre: [null, Validators.required],
    apellidoPaterno: [null, Validators.required],
    apellidoMaterno: [null, Validators.required],
    estado: [null, Validators.required],
    telefono: [null, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")],
    contrasenia: [null, [Validators.required, Validators.pattern(this.regexContrasenia)]],
    confirmacionContrasenia: [null, Validators.required]
  });

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

  get telefono() {
    return this.form.get("telefono");
  }

  get contrasenia() {
    return this.form.get("contrasenia");
  }

  get confirmacionContrasenia() {
    return this.form.get("confirmacionContrasenia");
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
      { type: "required", message: "*Por favor ingrese su estado de residencia." },
    ],
    correo: [
      { type: "required", message: "*Por favor ingrese su correo electrónico." },
      { type: "pattern", message: "*Por favor ingrese su correo electrónico válido." },
    ],
    telefono: [
      { type: "pattern", message: "*El número de teléfono debe tener 10 caracteres." },
    ],
    contrasenia: [
      { type: "required", message: "*Por favor ingrese su contraseña." },
      { type: "pattern", message: this.utilitiesService.mensajeRegexContrasenia() },

    ],
    confirmacionContrasenia: [
      { type: "required", message: "*Por favor confirme su contraseña." },
    ],
  };

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  constructor(private formBuilder: FormBuilder,
    public utilitiesService: UtilitiesService,
    public modalController: ModalController,
    private navCtrl: NavController,
    public webRestService: WebRestService) { }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async ngOnInit() {
    await this.setearValores()
    this.estados = await this.utilitiesService.obtenerEstadosRepublica();
    this.form.controls['confirmacionContrasenia'].valueChanges.subscribe(value => {
      if (value == this.form.controls['contrasenia'].value) {
        this.contraseniaComparacionValida = true;
      } else {
        this.contraseniaComparacionValida = false;
      }
    });

    this.form.controls['contrasenia'].valueChanges.subscribe(value => {
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
    if (this.datosPersonales.password != this.form.controls['contrasenia'].value) {
      await this.editarPassword();
    }

    if (this.usuario.name != this.form.controls['nombre'].value || this.usuario.last_name != this.form.controls['apellidoPaterno'].value
      || this.usuario.last_name_mother != this.form.controls['apellidoMaterno'].value || this.usuario.state != this.form.controls['estado'].value) {
      await this.editarDatosPersonales();
    }
    this.navCtrl.navigateRoot("mi-perfil")
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async editarDatosPersonales() {
    if (!this.form.valid) {
      this.utilitiesService.validaCamposFormulario([this.form]);
      return
    }

    let objeto: any = {
      email: this.usuario.email,
      name: this.form.controls['nombre'].value,
      last_name: this.form.controls['apellidoPaterno'].value,
      last_name_mother: this.form.controls['apellidoMaterno'].value,
      phone: this.form.controls['telefono'].value,
      state: this.form.controls['estado'].value,
      password: this.form.controls['contrasenia'].value
    }

    let respuesta = await this.webRestService.postAsync(API.endpoints.actualizarUsuario, objeto)

    if (respuesta.status == true) {

      this.usuario.name = objeto.name;
      this.usuario.last_name = objeto.last_name;
      this.usuario.last_name_mother = objeto.last_name_mother;
      this.usuario.email = objeto.email;
      this.usuario.phone = objeto.phone;
      this.usuario.state = objeto.state;
      localStorage.setItem("usuario", JSON.stringify(this.usuario))

      localStorage.setItem("opcionAlerta", "modificaciones-exitosas")
      const modal = await this.modalController.create({
        component: ModalAlertasCustomPage,
        cssClass: 'transparent-modal',
        componentProps: { mensaje: respuesta.message }
      })
      await modal.present();
    }
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async editarPassword() {
    let objeto: any = {
      email: this.usuario.email,
      password: this.form.controls['contrasenia'].value
    }

    let respuesta = await this.webRestService.postAsync(API.endpoints.setearContrasenia, objeto)
    console.log(respuesta)
    if (respuesta.status == true) {

      this.datosPersonales.password = objeto.password;
      localStorage.setItem("datosPersonales", JSON.stringify(this.datosPersonales))
      localStorage.setItem("opcionAlerta", "modificaciones-exitosas")
      const modal = await this.modalController.create({
        component: ModalAlertasCustomPage,
        cssClass: 'transparent-modal',
        componentProps: { mensaje: respuesta.message }
      })
      this.navCtrl.navigateRoot("mi-perfil")
      await modal.present();
    }else{
      if (respuesta.error.message.includes("anterior")) {
        localStorage.setItem("opcionAlerta", "contrasenia-anterior")
        const modal = await this.modalController.create({
          component: ModalAlertasCustomPage,
          cssClass: 'transparent-modal',
          componentProps: { mensaje: respuesta.error.message }
        })
        await modal.present();
      }
    }
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async cancelar() {
    localStorage.setItem("opcionAlerta", "cancelar-edicion")
      const modal = await this.modalController.create({
        component: ModalAlertasCustomPage,
        cssClass: 'transparent-modal',
        componentProps: { mensaje: "¿Está seguro de cancelar la modificación?" }
      })

      modal.onDidDismiss()
      .then(async (data) => {
        if (data.data) {
          this.navCtrl.navigateRoot("mi-perfil");
        } else {
          this.modalController.dismiss()
        }
      });

      await modal.present();

    
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async setearValores() {
    this.form.controls['nombre'].setValue(this.usuario.name)
    this.form.controls['apellidoPaterno'].setValue(this.usuario.last_name)
    this.form.controls['apellidoMaterno'].setValue(this.usuario.last_name_mother)
    this.form.controls['estado'].setValue(this.usuario.state)
    this.form.controls['telefono'].setValue(this.usuario.phone)
    this.form.controls['contrasenia'].setValue(this.datosPersonales.password)
    this.form.controls['confirmacionContrasenia'].setValue(this.datosPersonales.password)
  }
}
