import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { API } from 'src/app/endpoints';
import { WebRestService } from 'src/app/services/crud-rest.service';
import { sqliteService } from 'src/app/services/sqlite.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { ModalAlertasCustomPage } from '../modal-alertas-custom/modal-alertas-custom.page';

@Component({
  selector: 'app-hacer-transaccion',
  templateUrl: './hacer-transaccion.page.html',
  styleUrls: ['./hacer-transaccion.page.scss'],
})
export class HacerTransaccionPage implements OnInit {
  public licenciaSeleccionada = JSON.parse(localStorage.getItem('licenciaSeleccionada')!);
  public metodoPagoSeleccionado = JSON.parse(localStorage.getItem('metodoPagoSeleccionado')!);
  public usuario = JSON.parse(localStorage.getItem('usuario')!);
  public form: FormGroup = this.formBuilder.group({
    codigo: [null, Validators.required],
  });
  public mensajesValidacion = {
    codigo: [
      { type: "required", message: "*Campo obligatorio." },
    ]
  };
  get codigo() {
    return this.form.get("codigo");
  }
  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  constructor(private navCtrl: NavController,
    private formBuilder: FormBuilder,
    public utilitiesServices: UtilitiesService,
    public webRestService: WebRestService,
    public modalController: ModalController,
    private route: ActivatedRoute,
    public sqliteService: sqliteService) { }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async ngOnInit() {

  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public reygresar(ruta: string) {
    this.navCtrl.navigateRoot(ruta)
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  
  public async pagarPrepago() {
    let objeto = {
      code: this.form.controls["codigo"].value,
      license_id: this.licenciaSeleccionada.id,
      client_id: this.usuario.id,
      // month: Number(this.licenciaSeleccionada.mesNumero),
      // year: Number(this.licenciaSeleccionada.anio),
      month: 7,
      year: 2023
    }

    let respuesta = await this.webRestService.postAsync(API.endpoints.pagarPrepago, objeto);

    if (respuesta.status == 401) {
      localStorage.setItem("opcionAlerta", "error-pago-prepago")
      const modal = await this.modalController.create({
        component: ModalAlertasCustomPage,
        cssClass: 'transparent-modal',
        componentProps: { mensaje: respuesta.error.message }
      })
      await modal.present();
    }

    if (respuesta.status == true) {
      localStorage.setItem("opcionAlerta", "ya-puede-consultar")
      const modal = await this.modalController.create({
        component: ModalAlertasCustomPage,
        cssClass: 'transparent-modal',
        componentProps: { mensaje: respuesta.message }
      })
      modal.onDidDismiss().then(async (data) => {
        console.log(data)
        if (data?.data) {
          //proceso de descarga
          let objeto = {
            mes: 1,
            anio: 2023,
            client_id: this.usuario.id
          }
          this.descargarBd(objeto)
        } else {
          localStorage.setItem("opcionAlerta", "descarga-pendiente")
          const modal = await this.modalController.create({
            component: ModalAlertasCustomPage,
            cssClass: 'transparent-modal',
            componentProps: { mensaje: "" }
          })
          await modal.present();
        }
      });
      await modal.present();
    }


    console.log(respuesta)
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  
  public async descargarBd(licencia: any) {
    localStorage.setItem("opcionAlerta", "aviso-borrado-licencias")
    const modal = await this.modalController.create({
      component: ModalAlertasCustomPage,
      cssClass: 'transparent-modal',
      componentProps: { mensaje: "Esta acción borrará cualquier descarga vigente anterior, podrá seguir consultándola en línea" }
    })

    modal.onDidDismiss()
      .then(async (data) => {
        if (data.data) {
          await this.sqliteService.verificacionConexion(licencia.mes, licencia.anio, true);
        } else {
          localStorage.setItem("opcionAlerta", "descarga-pendiente")
          const modal = await this.modalController.create({
            component: ModalAlertasCustomPage,
            cssClass: 'transparent-modal',
            componentProps: {
              mensaje: ""
            }
          })
          this.navCtrl.navigateRoot("mi-perfil")
          await modal.present();
        }
      });
    await modal.present();
  }

}
