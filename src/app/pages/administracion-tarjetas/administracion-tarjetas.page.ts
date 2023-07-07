import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ModalController, NavController } from '@ionic/angular';
import { API } from 'src/app/endpoints';
import { WebRestService } from 'src/app/services/crud-rest.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { ModalAlertasCustomPage } from '../modal-alertas-custom/modal-alertas-custom.page';

@Component({
  selector: 'app-administracion-tarjetas',
  templateUrl: './administracion-tarjetas.page.html',
  styleUrls: ['./administracion-tarjetas.page.scss'],
})
export class AdministracionTarjetasPage implements OnInit {

  public listadoLicencias: any[] = [];
  public usuario = JSON.parse(localStorage.getItem('usuario')!);
  public ingresaNuevaTarjeta: boolean = false;

  constructor(private navCtrl: NavController,
    private formBuilder: FormBuilder,
    public utilitiesServices: UtilitiesService,
    public webRestService: WebRestService,
    public modalController: ModalController) { }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async ngOnInit() {
    localStorage.removeItem("tarjetaSeleccionada")
    await this.obtenerTarjetas()
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public reygresar() {
    this.navCtrl.navigateRoot("pagos")
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async obtenerTarjetas() {
    let objeto: any = {
      id_client: this.usuario.id
    }
    let respuesta = await this.webRestService.postAsync(API.endpoints.listadoTarjetas, objeto);
    if (respuesta.status == true && respuesta.list_card.length > 0) {
      this.listadoLicencias = respuesta.list_card;

      for (let i = 0; i < this.listadoLicencias.length; i++) {
        let maskTarjeta = "**** **** **** " + this.listadoLicencias[i].card_number.substring(this.listadoLicencias[i].card_number.length - 4);
        this.listadoLicencias[i].maskTarjeta = maskTarjeta;
        this.listadoLicencias[i].seleccionada = false;
      }

    } else {
      this.listadoLicencias = [];
    }
    console.log(respuesta)
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async seleccionarTarjeta(tarjeta: any) {
    if (!tarjeta.seleccionada) {
      for (let i = 0; i < this.listadoLicencias.length; i++) {
        if (tarjeta.id == this.listadoLicencias[i].id) {
          this.listadoLicencias[i].seleccionada = true;
        } else {
          this.listadoLicencias[i].seleccionada = false;
        }
      }
      localStorage.setItem("tarjetaSeleccionada", JSON.stringify(tarjeta))
      localStorage.setItem("opcionAlerta", "confirmacion-cvv")
      const modal = await this.modalController.create({
        component: ModalAlertasCustomPage,
        cssClass: 'transparent-modal',
        componentProps: { mensaje: "" }
      })

      modal.onDidDismiss().then(async (data) => {
        console.log(data)
        if (data?.data?.exito) {
          localStorage.setItem("cvv", data?.data?.formulario.cvv)
          this.navCtrl.navigateRoot("resumencompra-transferencia-prepago/2")
        } else {
          for (let i = 0; i < this.listadoLicencias.length; i++) {
            this.listadoLicencias[i].seleccionada = false;
          }
        }
      });

      await modal.present();
    }
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async eliminarTarjeta(tarjeta: any) {
    localStorage.setItem("opcionAlerta", "eliminar-metodo-pago")
    const modal = await this.modalController.create({
      component: ModalAlertasCustomPage,
      cssClass: 'transparent-modal',
      componentProps: { mensaje: "¿Está seguro de que desea eliminar su método de pago?" }
    })
    modal.onDidDismiss().then(async (data) => {
      if (data.data) {
        let objeto: any = {
          id_card: tarjeta.id,
          id_client: this.usuario.id
        }
        let respuesta = await this.webRestService.postAsync(API.endpoints.eliminarTarjeta, objeto);
        console.log(respuesta)

        if (respuesta.status == true) {
          localStorage.setItem("opcionAlerta", "eliminacion-correcta")
          const modal = await this.modalController.create({
            component: ModalAlertasCustomPage,
            cssClass: 'transparent-modal',
            componentProps: { mensaje: respuesta.message }
          })
          await modal.present();
          await this.ngOnInit();
        }

      } else {
        this.modalController.dismiss()
      }
    });
    await modal.present();
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async altaNuevaTarjeta() {
    this.navCtrl.navigateRoot("alta-nueva-tarjeta")
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async editarTarjeta(tarjeta: any) {
    localStorage.setItem("tarjetaEditar", JSON.stringify(tarjeta))
    this.navCtrl.navigateRoot("alta-nueva-tarjeta/2")
  }

}
