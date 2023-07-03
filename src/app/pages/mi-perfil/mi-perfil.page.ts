import { Component, OnInit } from '@angular/core';
import { MenuController, ModalController, NavController } from '@ionic/angular';
import { API } from 'src/app/endpoints';
import { WebRestService } from 'src/app/services/crud-rest.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { sqliteService } from 'src/app/services/sqlite.service';
import { Subscription } from 'rxjs';
import { ModalAlertasCustomPage } from '../modal-alertas-custom/modal-alertas-custom.page';

@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.page.html',
  styleUrls: ['./mi-perfil.page.scss'],
})
export class MiPerfilPage implements OnInit {
  public usuario = JSON.parse(localStorage.getItem('usuario')!);
  public licenciaActual: any[] = []
  public historicoLicencias: any[] = [];
  public mesActual: any = new Date();
  public totalCargados: number = 0;
  public totalDescarga: number = 0;
  public estaCargando: boolean = false;
  totalesDescargaChangedSubscription: Subscription | undefined;
  totalesCargadosChangedSubscription: Subscription | undefined;
  estaCargandoChangedSubscription: Subscription | undefined;
  public mostrarAdquirirLicencia: boolean = false;
  public progress = 0;
  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  constructor(private menu: MenuController,
    private navCtrl: NavController,
    public webService: WebRestService,
    public utilitiesServices: UtilitiesService,
    public sqliteService: sqliteService,
    public modalController: ModalController) { }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async ngOnInit() {
    await this.validarTransferencia();
    this.totalesDescargaChangedSubscription = this.sqliteService.totalDescargaObs$.subscribe((valor) => {
      this.totalDescarga = valor;
    })

    this.totalesCargadosChangedSubscription = this.sqliteService.totalCargadosObs$.subscribe((valor) => {
      this.totalCargados = valor;
      this.progress = (this.totalCargados / this.totalDescarga) * 100;
    })

    this.estaCargandoChangedSubscription = this.sqliteService.estaDescargandoObs$.subscribe((valor) => {
      this.estaCargando = valor;
      // if(this.totalCargados == this.totalDescarga){
      this.progress = 0;
      // }
    })



    this.mesActual = this.mesActual.getMonth() + 1;
    console.log(this.usuario)
    await this.obtenerHistoricoLicencias();
    await this.validarLicenciaActiva();
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  openMenu() {
    this.menu.open();
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public navegarA(ruta: string) {
    this.navCtrl.navigateRoot(ruta);
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async obtenerHistoricoLicencias() {
    let objeto = {
      client_id: this.usuario.id,
      mobile_identifier: "dnaibdayb82u31"
    }
    let respuesta = await this.webService.postAsync(API.endpoints.historialLicencias, objeto)
    console.log(respuesta)

    if (respuesta.status == true) {
      for (let i = 0; i < respuesta?.data.length; i++) {
        respuesta.data[i].mes = this.utilitiesServices.obtenerMesStringActual(respuesta.data[i].month_hire)
        if (respuesta.data[i].active == 1 || respuesta.data[i].active == 2) {
          this.licenciaActual.push(respuesta.data[i])
        } else {
          this.historicoLicencias.push(respuesta.data[i])
        }

      }
    }

  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async validarLicenciaActiva() {
    let respuesta = await this.webService.getAsync(API.endpoints.validarLicencia + '?client_id=' + this.usuario.id)
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
          await this.sqliteService.verificacionConexion(licencia.month_hire, licencia.year_hire);
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
        }
      });
    await modal.present();



  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async cancelarDescarga() {
    await this.sqliteService.cancelarDescarga();
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async validarTransferencia() {
    let respuesta = await this.webService.getAsync(API.endpoints.validarMetodosPagos)
    console.log(respuesta)
    if (respuesta.status == true) {
      for (let i = 0; i < respuesta.paymet_method.length; i++) {
        if (respuesta.paymet_method[i].id == 2 || respuesta.paymet_method[i].id == 3) {
          this.mostrarAdquirirLicencia = true;
        }
      }
      return;
    }


  }



}
