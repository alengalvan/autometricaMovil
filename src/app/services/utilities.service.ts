import { Injectable } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { AlertController, LoadingController, NavController, ToastController } from '@ionic/angular';
import { Device } from '@capacitor/device';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {

  constructor(private navCtrl: NavController,
    private alertCtrl: AlertController,
    private toastController: ToastController,
    private loadingController: LoadingController,
    public alertController: AlertController,

    // private androidPermissions: AndroidPermissions,
    // private uid: Uid

  ) { }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async alert(title: string, message: string, nombreBoton?: string) {
    this.alertCtrl.create({
      cssClass: "alertCustom",
      // mode: "md",
      header: title,
      message: message,
      buttons: [{
        text: nombreBoton ? nombreBoton : "Aceptar"
      }]
    }).then(alert => {
      alert.present();
    });
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public toast(message: string, duration: number = 3000, position: any = "bottom") {
    this.toastController.create({
      message: message,
      cssClass: "toast",
      duration: duration,
      position: position //"top" | "bottom" | "middle"
    }).then(toast => {
      toast.present();
    });
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async presentAlertConfirm(message: string): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      const alert = await this.alertCtrl.create({
        cssClass: 'my-custom-class',
        message: message,
        mode: 'md',
        buttons: [
          {
            text: 'cancelar',
            role: 'cancel',
            cssClass: 'botonCancelar',
            handler: (blah) => {
              return resolve(false);
            }
          }, {
            text: 'aceptar',
            cssClass: 'botonAceptar',
            handler: () => {
              return resolve(true)
            }
          }
        ]
      });
      alert.present();
    });
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async obtenerEstadosRepublica() {
    return [
      {
        "nombre": "AGUASCALIENTES"
      },
      {
        "nombre": "BAJA CALIFORNIA"
      },
      {
        "nombre": "BAJA CALIFORNIA SUR"
      },
      {
        "nombre": "CAMPECHE"
      },
      {
        "nombre": "CHIAPAS"
      },
      {
        "nombre": "CHIHUAHUA"
      },
      {
        "nombre": "CIUDAD DE MEXICO"
      },
      {
        "nombre": "COAHUILA"
      },
      {
        "nombre": "COLIMA"
      },
      {
        "nombre": "DURANGO"
      },
      {
        "nombre": "ESTADO DE MEXICO"
      },
      {
        "nombre": "GUANAJUATO"
      },
      {
        "nombre": "GUERRERO"
      },
      {
        "nombre": "HIDALGO"
      },
      {
        "nombre": "JALISCO"
      },
      {
        "nombre": "MICHOACAN"
      },
      {
        "nombre": "MORELOS"
      },
      {
        "nombre": "NAYARIT"
      },
      {
        "nombre": "NUEVO LEON"
      },
      {
        "nombre": "OAXACA"
      },
      {
        "nombre": "PUEBLA"
      },
      {
        "nombre": "QUERETARO"
      },
      {
        "nombre": "QUINTANA ROO"
      },
      {
        "nombre": "SAN LUIS POTOSI"
      },
      {
        "nombre": "SINALOA"
      },
      {
        "nombre": "SONORA"
      },
      {
        "nombre": "TABASCO"
      },
      {
        "nombre": "TAMAULIPAS"
      },
      {
        "nombre": "TLAXCALA"
      },
      {
        "nombre": "VERACRUZ"
      },
      {
        "nombre": "YUCATAN"
      },
      {
        "nombre": "ZACATECAS"
      }
    ]
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  validaCamposFormulario(formGroups: FormGroup[]) {
    formGroups.forEach((formulario) => {
      Object.keys(formulario.controls).forEach((field) => {
        const control = formulario.get(field);
        if (control instanceof FormControl) {
          control.markAsTouched({ onlySelf: true });
        } else if (control instanceof FormGroup) {
          this.validaCamposFormulario([control]);
        } else if (control instanceof FormArray) {
          control.controls.forEach((element) => {
            if (element instanceof FormControl) {
              element.markAsTouched({ onlySelf: true });
            } else if (element instanceof FormGroup) {
              this.validaCamposFormulario([element]);
            }
          });
        }
      });
    });
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public alertaPrompt(titulo: string, mensaje: string, placeholder?: string) {
    const alerta = this.alertController.create({
      header: titulo,
      inputs: [
        {
          name: 'input',
          placeholder: placeholder ? placeholder : ''
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: data => {

          }
        },
        {
          text: 'Aceptar',
          handler: async data => {
            if (data.input !== '') {
              await (await alerta).dismiss(true);
              return false;
            } else {
              (await alerta).message = 'Este campo es obligatorio';
              return false;
            }
          }
        }
      ]
    });
    return alerta;
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async mensajeDeConfirmacion(titulo: string, mensaje: string, si?: string, no?: string) {
    const alert = await this.alertController.create({
      cssClass: 'alert-class',
      header: titulo,
      message: mensaje,
      buttons: [
        {
          text: no ? no : 'Cancelar',
          role: 'no',
          handler: async () => {
            await alert.dismiss(false);
            return false;
          }
        },
        {
          text: si ? si : 'Aceptar',
          role: 'si',
          handler: async () => {
            await alert.dismiss(true);
            return false;
          }
        }
      ]
    });
    return alert;
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async solicitarPermisos() {
    // const { hasPermission } = await this.androidPermissions.checkPermission(
    //   this.androidPermissions.PERMISSION.READ_PHONE_STATE
    // );

    // if (!hasPermission) {
    //   const result = await this.androidPermissions.requestPermission(
    //     this.androidPermissions.PERMISSION.READ_PHONE_STATE
    //   );

    //   if (!result.hasPermission) {
    //     throw new Error('Permissions required');
    //   }

    //   // ok, a user gave us permission, we can get him identifiers after restart app
    //   return;
    // }

    //  return this.uid.IMEI
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async obtenerInfo() {
    // const info = await Device.getInfo();
    // return info;
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  async presentLoading(msg: string, time = 600000) {
    const loading = await this.loadingController.create({
      cssClass: 'alert-classLoading',
      message: msg,
      keyboardClose: true,
      duration: time
    });
    await loading.present();
    return loading;
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public obtenerMesStringActual(mes: number) {
    if (mes == 1) {
      return "Enero";
    } else if (mes == 2) {
      return "Febrero";
    } else if (mes == 3) {
      return "Marzo";
    } else if (mes == 4) {
      return "Abril";
    } else if (mes == 5) {
      return "Mayo";
    } else if (mes == 6) {
      return "Junio";
    } else if (mes == 7) {
      return "Julio";
    } else if (mes == 8) {
      return "Agosto";
    } else if (mes == 9) {
      return "Septiembre";
    } else if (mes == 10) {
      return "Octubre";
    } else if (mes == 11) {
      return "Noviembre";
    } else if (mes == 12) {
      return "Diciembre";
    } else {
      return "Diciembre";
    }
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async numeroAMes(numero: number){
    switch (numero) {
      case 1:
        return "Enero";
      case 2:
        return "Febrero";
      case 3:
        return "Marzo";
      case 4:
        return "Abril";
      case 5:
        return "Mayo";
      case 6:
        return "Junio";
      case 7:
        return "Julio";
      case 8:
        return "Agosto";
      case 9:
        return "Septiembre";
      case 10:
        return "Octubre";
      case 11:
        return "Noviembre";
      case 12:
        return "Diciembre";
      default:
        return "Enero";
    }
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async idTelefono(){
    // return (await Device.getId()).identifier;
    return "c06c7c5f8b043518"
  }

  public mensajeRegexContrasenia(){
    let signo = '"';
    return "*La contraseña debe tener al menos 8 caracteres, un número, un caracter especial $ @ ! % * ? & _ - + # . ( / " + signo + " ' : ; una letra mayúscula y letras minúsculas."
  }

}
