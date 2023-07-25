import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonInput, ModalController, NavController } from '@ionic/angular';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { ModalAlertasCustomPage } from '../modal-alertas-custom/modal-alertas-custom.page';
import { WebRestService } from 'src/app/services/crud-rest.service';
import { API } from 'src/app/endpoints';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-restablecer-contrasenia',
  templateUrl: './restablecer-contrasenia.page.html',
  styleUrls: ['./restablecer-contrasenia.page.scss'],
})
export class RestablecerContraseniaPage implements OnInit {
  @ViewChild('inputPassword', { static: false })
  inputPassword!: IonInput;
  public verContrasena: boolean = false;
  @ViewChild('inputPasswordConfirm', { static: false })
  inputPasswordConfirm!: IonInput;
  public verContrasenaConfirm: boolean = false;
  public regexContrasenia = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?#"'(/.:;+&_-])([A-Za-z\d$@$!%*?#"'(/.:;+&_-]|[^ ]){8,20}$/;
  public contraseniaComparacionValida: boolean = false;
  public id : any = null;
  public form: FormGroup = this.formBuilder.group({
    contrasenia: [null, [Validators.required, Validators.pattern(this.regexContrasenia)]],
    confirmarContrasenia: [null, Validators.required],
  });
  public datosCorreo: any = null;
  public correo: string = "";

  public mensajesValidacion = {
    contrasenia: [
      { type: "required", message: "*Por favor ingrese su contraseña." },
      { type: "pattern", message: this.utilitiesService.mensajeRegexContrasenia() },

    ],
    confirmarContrasenia: [
      { type: "required", message: "*Por favor confirme su contraseña." },
    ],
  };

  get contrasenia() {
    return this.form.get("contrasenia");
  }
  get confirmarContrasenia() {
    return this.form.get("confirmarContrasenia");
  }

  constructor(private formBuilder: FormBuilder,
    public utilitiesService: UtilitiesService,
    public modalController: ModalController,
    public webRestService: WebRestService,
    private route: ActivatedRoute, private navCtrl: NavController) { }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async ngOnInit() {
    this.datosCorreo = localStorage.getItem("datosRedireccionamiento");
    this.correo = this.datosCorreo.split("/")[4];

    
    this.form.controls['confirmarContrasenia'].valueChanges.subscribe(value => {
      console.log(value);
      if (value == this.form.controls['contrasenia'].value) {
        this.contraseniaComparacionValida = true;
      } else {
        this.contraseniaComparacionValida = false;
      }
    });

    this.form.controls['contrasenia'].valueChanges.subscribe(value => {
      console.log(value);
      if (value == this.form.controls['confirmarContrasenia'].value) {
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
  public async cambiarContrasenia() {
    if (!this.form.valid) {
      this.utilitiesService.validaCamposFormulario([this.form]);
      localStorage.setItem("opcionAlerta", "login-cinco-intentos")
      const modal = await this.modalController.create({
        component: ModalAlertasCustomPage,
        cssClass: 'transparent-modal',
        componentProps: { mensaje: this.utilitiesService.mensajeRegexContrasenia() }
      })
      await modal.present();
      return
    }

    if (!this.contraseniaComparacionValida) {
      this.utilitiesService.validaCamposFormulario([this.form]);
      localStorage.setItem("opcionAlerta", "login-cinco-intentos")
      const modal = await this.modalController.create({
        component: ModalAlertasCustomPage,
        cssClass: 'transparent-modal',
        componentProps: { mensaje: "Las contraseñas no coinciden." }
      })
      await modal.present();
      return
    }


    let objeto: any = {
      email: this.correo,
      password: this.form.controls['contrasenia'].value
    }
    let respuesta = await this.webRestService.postAsync(API.endpoints.setearContrasenia, objeto)
    console.log(respuesta)

    if (respuesta.error) {

      if (respuesta.error.message == "La contraseña no puede ser la misma que la anterior.") {
        localStorage.setItem("opcionAlerta", "login-cinco-intentos")
        const modal = await this.modalController.create({
          component: ModalAlertasCustomPage,
          cssClass: 'transparent-modal',
          componentProps: { mensaje: respuesta.error.message }
        })
        await modal.present();
        return
      }
    }

    if(respuesta.status){
      localStorage.setItem("opcionAlerta", "restablecer-contrasenia-exitoso")
        const modal = await this.modalController.create({
          component: ModalAlertasCustomPage,
          cssClass: 'transparent-modal',
          componentProps: { mensaje: respuesta.message }
        })
        await modal.present();
        this.navCtrl.navigateRoot("login");
        return;
    }


  }

  public async ngOnDestroy() {
    console.log("se destruye")
    let backDrop: any = document.querySelector('ion-backdrop');
    if (backDrop != null) {
      backDrop.click();
    }
  }

}
