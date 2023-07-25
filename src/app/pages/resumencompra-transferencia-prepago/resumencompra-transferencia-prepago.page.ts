import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { API } from 'src/app/endpoints';
import { WebRestService } from 'src/app/services/crud-rest.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { ModalAlertasCustomPage } from '../modal-alertas-custom/modal-alertas-custom.page';
import { sqliteService } from 'src/app/services/sqlite.service';

@Component({
  selector: 'app-resumencompra-transferencia-prepago',
  templateUrl: './resumencompra-transferencia-prepago.page.html',
  styleUrls: ['./resumencompra-transferencia-prepago.page.scss'],
})
export class ResumencompraTransferenciaPrepagoPage implements OnInit {

  public id = this.route.snapshot.paramMap.get('id');
  public licenciaSeleccionada = JSON.parse(localStorage.getItem('licenciaSeleccionada')!);
  public metodoPagoSeleccionado = JSON.parse(localStorage.getItem('metodoPagoSeleccionado')!);
  public cvv = JSON.parse(localStorage.getItem('cvv')!);
  public tarjetaSeleccionada = JSON.parse(localStorage.getItem('tarjetaSeleccionada')!);
  public mes: any = null;
  public anio: any = null;
  public usuario = JSON.parse(localStorage.getItem('usuario')!);

  constructor(
    private navCtrl: NavController,
    private formBuilder: FormBuilder,
    public utilitiesServices: UtilitiesService,
    public webRestService: WebRestService,
    public modalController: ModalController,
    private route: ActivatedRoute,
    public sqliteService: sqliteService) { }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async ngOnInit() {
    if(!this.usuario){
      this.navCtrl.navigateRoot("login");
      return
    }
    const modal = await this.modalController.getTop();
    if(modal){
      await this.utilitiesServices.cerrarModal();
    }
    console.log(this.licenciaSeleccionada);
    console.log(this.metodoPagoSeleccionado);
    console.log(this.tarjetaSeleccionada)
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  
  public regresar() {
    this.navCtrl.navigateRoot("metodos-pago")
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  
  public async pagarTarjeta() {
    var objetoPrincipal = {
      card_payment: this.tarjetaSeleccionada.id,
      amount: this.licenciaSeleccionada.price,
      // cvv2: Number(localStorage.getItem("cvv")),
      license_id: this.licenciaSeleccionada.id,
      month: Number(this.licenciaSeleccionada.mesNumero),
      year: Number(this.licenciaSeleccionada.anio),
    }

    let respuesta = await this.webRestService.postAsync(API.endpoints.pagarTarjeta, objetoPrincipal);
    console.log(respuesta)
    if (respuesta.status == 401 || respuesta.status == false) {
      localStorage.setItem("opcionAlerta", "error-pago-prepago-tarjeta")
      const modal = await this.modalController.create({
        component: ModalAlertasCustomPage,
        cssClass: 'transparent-modal',
        componentProps: { mensaje: "El pago no pudo completarse. Por favor intente con otro método de pago." }
      })
      modal.onDidDismiss().then(async (data) => {
        console.log(data)
        if (data?.data) {
          this.navCtrl.navigateRoot("metodos-pago")
        } else {
          this.navCtrl.navigateRoot("mi-perfil")
        }
      });
      await modal.present();
    }

    if (respuesta.status == true) {
      localStorage.setItem("opcionAlerta", "compra-exitosa")
      const modal = await this.modalController.create({
        component: ModalAlertasCustomPage,
        cssClass: 'transparent-modal',
        componentProps: { mensaje: "El pago fue realizado exitosamente." + "<br>" + "Si requiere factura contáctenos." }
      })
      modal.onDidDismiss().then(async (data) => {
        localStorage.setItem("opcionAlerta", "ya-puede-consultar")
        const modal = await this.modalController.create({
          component: ModalAlertasCustomPage,
          cssClass: 'transparent-modal',
          componentProps: { mensaje: respuesta.message }
        })
        modal.onDidDismiss().then(async (data) => {
          console.log(data)
          if (data?.data) {
            let objeto = {
              mes: objetoPrincipal.month,
              anio: objetoPrincipal.year,
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
            this.navCtrl.navigateRoot("mi-perfil")
          }
        });
        await modal.present();
      });
      await modal.present();
    }
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  
  public async descargarBd(licencia: any) {
    localStorage.setItem("opcionAlerta", "aviso-borrado-licencias")
    const modal = await this.modalController.create({
      component: ModalAlertasCustomPage,
      cssClass: 'transparent-modal',
      componentProps: { mensaje: "Esta acción borrará cualquier descarga vigente anterior, podrá seguir consultándola en línea." }
    })

    modal.onDidDismiss()
      .then(async (data) => {
        if (data.data) {
          await this.sqliteService.verificacionConexion(licencia.mes, licencia.anio, true);
        } else {
          this.modalController.dismiss();
          localStorage.setItem("opcionAlerta", "descarga-pendiente")
          const modal = await this.modalController.create({
            component: ModalAlertasCustomPage,
            cssClass: 'transparent-modal',
            componentProps: {
              mensaje: ""
            }
          })
          await modal.present();
          this.navCtrl.navigateRoot("mi-perfil")
        }
      });
    await modal.present();
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  
  public async pagarConTranferencia() {
    let objeto = {
      license_id: this.licenciaSeleccionada.id,
      client_id: this.usuario.id,
      month: Number(this.licenciaSeleccionada.mesNumero),
      year: Number(this.licenciaSeleccionada.anio),
    }

    let respuesta = await this.webRestService.postAsync(API.endpoints.pagarTransferencia, objeto);

    if (respuesta.status == 401) {
      localStorage.setItem("opcionAlerta", "error-pago-prepago-tarjeta")
      const modal = await this.modalController.create({
        component: ModalAlertasCustomPage,
        cssClass: 'transparent-modal',
        componentProps: { mensaje: respuesta.error.message }
      })
      modal.onDidDismiss().then(async (data) => {
        console.log(data)
        if (data?.data) {
          this.navCtrl.navigateRoot("metodos-pago")
        } else {
          this.navCtrl.navigateRoot("mi-perfil")
        }
      });
      await modal.present();
    }

    if (respuesta.status == true) {
      localStorage.setItem("opcionAlerta", "compra-exitosa")
      const modal = await this.modalController.create({
        component: ModalAlertasCustomPage,
        cssClass: 'transparent-modal',
        componentProps: { mensaje: respuesta.message }
      })
      await modal.present();
      this.navCtrl.navigateRoot("mi-perfil")
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
