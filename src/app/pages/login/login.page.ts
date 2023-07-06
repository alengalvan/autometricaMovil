import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonInput, ModalController, NavController } from '@ionic/angular';
import { API } from 'src/app/endpoints';
import { WebRestService } from 'src/app/services/crud-rest.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { ModalAlertasCustomPage } from '../modal-alertas-custom/modal-alertas-custom.page';
import { Http, HttpDownloadFileResult } from '@capacitor-community/http';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { HttpClient } from '@angular/common/http'
import { BehaviorSubject } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { Device } from '@capacitor/device';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  @ViewChild('inputPassword', { static: false })
  inputPassword!: IonInput;
  public verContrasena: boolean = false;
  public regexContrasenia = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){8,20}$/;
  public form: FormGroup = this.formBuilder.group({
    usuario: ["", [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$")]],
    contrasenia: [null, [Validators.required, Validators.pattern(this.regexContrasenia)]],
    recordarContrasenia: [null]
  });
  public idMobile: any = "";
  fileName: any;

  get usuario() {
    return this.form.get("usuario");
  }

  get contrasenia() {
    return this.form.get("contrasenia");
  }

  public mensajesValidacion = {
    usuario: [
      { type: "required", message: "*Por favor ingrese su correo electrónico." },
      { type: "pattern", message: "*Correo electrónico no válido" },
    ],
    contrasenia: [
      { type: "required", message: "*Por favor ingrese su contraseña." },
      { type: "pattern", message: "*La contraseña debe tener al menos 8 caracteres, un número, un carácter especial, una letra mayúscula y letras minúsculas." },
    ]
  };
  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  constructor(private formBuilder: FormBuilder,
    private navCtrl: NavController,
    public utilitiesService: UtilitiesService,
    public webRestService: WebRestService,
    public modalController: ModalController,
    public http: HttpClient,
    public userService: UserService) { }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async ngOnInit() {
    this.idMobile = (await Device.getId()).identifier;
    await this.utilitiesService.obtenerInfo();
    let datosPersonales = JSON.parse(localStorage.getItem('datosPersonales')!);
    console.log(datosPersonales)
    if (datosPersonales) {
      await this.iniciarSesionAutomatico(datosPersonales)
    }
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public mostrarContrasena() {
    if (this.verContrasena) this.verContrasena = false;
    else this.verContrasena = true;
    this.inputPassword.type = this.verContrasena ? 'text' : 'password';
    this.inputPassword.autofocus;
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public goToRecuperarContrasenia() {
    this.navCtrl.navigateRoot("recuperar-contrasenia");
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async iniciarSesion() {

    // await this.descargarDocumentacion(1, 'https://niksviks.in/test/filedownload/downloader.php?filename=test12345.pdf')
    // await this.descargarDocumentacion(2, 'https://niksviks.in/test/filedownload/downloader.php?filename=test12345.pdf')
    // await this.descargarDocumentacion(3, 'https://niksviks.in/test/filedownload/downloader.php?filename=test12345.pdf')
    // await this.descargarDocumentacion(4, 'https://niksviks.in/test/filedownload/downloader.php?filename=test12345.pdf')


    if (!this.form.valid) {
      this.utilitiesService.validaCamposFormulario([this.form]);
      return
    }

    let objeto: any = {
      email: this.form.controls['usuario'].value,
      password: this.form.controls['contrasenia'].value,
      // mobile_identifier: "c06c7c5f8b043518",
      mobile_identifier: this.idMobile,
    }
    let respuesta = await this.webRestService.postAsync(API.endpoints.login, objeto)
    console.log(respuesta)

    if (respuesta.status == true) {
      this.userService.iniciarSesion(true)
      localStorage.setItem("datosPersonales", JSON.stringify(objeto))
      localStorage.setItem("usuario", JSON.stringify(respuesta.user))
      localStorage.setItem("token", JSON.stringify(respuesta.token))
      if (this.form.controls['recordarContrasenia'].value) {
        localStorage.setItem("recordarContrasenia", 'recordarContrasenia')
      }
      this.navCtrl.navigateRoot("mi-perfil");
      return;
    } else {
      if (respuesta.error.code == 6 || respuesta.error.code == 2 || respuesta.error.code == 4) {
        localStorage.setItem("opcionAlerta", "usuario-inactivo")
        const modal = await this.modalController.create({
          component: ModalAlertasCustomPage,
          cssClass: 'transparent-modal',
          componentProps: { mensaje: respuesta.error.message }
        })
        await modal.present();
      }

      if (respuesta.error.code == 5) {
        localStorage.setItem("opcionAlerta", "login-cinco-intentos")
        const modal = await this.modalController.create({
          component: ModalAlertasCustomPage,
          cssClass: 'transparent-modal',
          componentProps: { mensaje: respuesta.error.message }
        })
        await modal.present();
      }

      if (respuesta.error.code == 3) {
        localStorage.setItem("opcionAlerta", "login-sesion-activa")
        const modal = await this.modalController.create({
          component: ModalAlertasCustomPage,
          cssClass: 'transparent-modal',
          componentProps: { mensaje: respuesta.error.message }
        })
        await modal.present();
      }

      if (respuesta.error.code == 8) {
        localStorage.setItem("opcionAlerta", "usuario-no-validado")
        localStorage.setItem("correoVerificar", objeto.email)
        const modal = await this.modalController.create({
          component: ModalAlertasCustomPage,
          cssClass: 'transparent-modal',
          componentProps: { mensaje: respuesta.error.message }
        })
        await modal.present();
        return;
      }

      if (respuesta.status == 500) {
        localStorage.setItem("code", "500")
        const modal = await this.modalController.create({
          component: ModalAlertasCustomPage,
          cssClass: 'transparent-modal',
          componentProps: { mensaje: 'Error inesperado, por favor intente más tarde.' }
        })
        await modal.present();
      }
    }
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async iniciarSesionAutomatico(valores: any) {
    let objeto: any = {
      email: valores.email,
      password: valores.password,
      // mobile_identifier: "c06c7c5f8b043518",
      mobile_identifier: this.idMobile,
    }

    let respuesta = await this.webRestService.postAsync(API.endpoints.login, objeto)
    console.log(respuesta)

    if (respuesta.status == true) {
      localStorage.setItem("datosPersonales", JSON.stringify(objeto))
      localStorage.setItem("usuario", JSON.stringify(respuesta.user))
      localStorage.setItem("token", JSON.stringify(respuesta.token))

      if (this.form.controls['recordarContrasenia'].value) {
        localStorage.setItem("recordarContrasenia", 'recordarContrasenia')
      }

      this.navCtrl.navigateRoot("mi-perfil");
      return;
    }

    if (respuesta.status == 401) {
      await this.utilitiesService.alert("", respuesta.error.message)
      return;
    }
  }


  public async descargarDocumentacion(number: number, URL: any) {

    let ref = this;
    this.fileName = URL.split("=")[1];
    this.http.get(URL, { responseType: "blob" }).subscribe((res: Blob) => {
      var reader = new FileReader();
      reader.readAsDataURL(res);
      reader.onloadend = function () {
        let base64 = reader.result?.toString();
        ref.savePDF(number, base64)
      }
    })
  }

  public savePDF(number: any, base64: any) {
    let nombreArchivo = number == 1 ? 'glosario.pdf' : number == 2 ? 'kilometraje.pdf' : number == 3 ? 'tyc.pdf' : 'ap.pdf'
    Filesystem.writeFile({
      path: nombreArchivo,
      data: base64,
      directory: Directory.Documents
    }).then((res) => {
      console.log(res)
      localStorage.setItem(number == 1 ? 'pathGlosarioFile' : number == 2 ? 'pathKilometrajeFile' : number == 3 ? 'pathTycFile' : 'pathApFile', res.uri)
    }, (err) => {
      alert(err)
    })
  }



}
