import { Component, OnInit } from '@angular/core';
import { MenuController, ModalController, NavController } from '@ionic/angular';
import { API } from 'src/app/endpoints';
import { WebRestService } from 'src/app/services/crud-rest.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { sqliteService } from 'src/app/services/sqlite.service';
import { Subscription } from 'rxjs';
import { ModalAlertasCustomPage } from '../modal-alertas-custom/modal-alertas-custom.page';
import { Device } from '@capacitor/device'
import { Network } from '@capacitor/network';
import { PluginListenerHandle } from '@capacitor/core';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.page.html',
  styleUrls: ['./mi-perfil.page.scss'],
})
export class MiPerfilPage implements OnInit {
  networkStatus: any;
  networkListener: PluginListenerHandle | undefined;

  public usuario = JSON.parse(localStorage.getItem('usuario')!);

  edicionDescargada = JSON.parse(localStorage.getItem('edicionDescargada')!);
  public licenciaActual: any[] = []
  public historicoLicencias: any[] = [];
  public mesActual: any = new Date();
  public mostrarAdquirirLicencia: number = 0;
  public mostrarCanjear: number = 0;
  public hayInternet: boolean = false;
  public acomodoAsc: boolean = true;

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  constructor(private menu: MenuController,
    private navCtrl: NavController,
    public webService: WebRestService,
    public utilitiesServices: UtilitiesService,
    public sqliteService: sqliteService,
    public modalController: ModalController,
    public userService: UserService) { }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async ngOnInit() {

    if(!this.usuario){
      this.navCtrl.navigateRoot("login");
      return
    }
    
    console.log("esta es la licencia que se ha descargado ", this.edicionDescargada)

    this.hayInternet = (await Network.getStatus()).connected;

    Network.addListener('networkStatusChange', status => {
      console.log('Network status changed', status);
      this.hayInternet = status.connected;
    });


    await this.recargar();
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async recargar() {
    await this.validarTransferencia();
    this.mesActual = new Date().getMonth() + 1;
    console.log(this.usuario)
    await this.obtenerHistoricoLicencias();
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  openMenu() {
    this.menu.open();
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async navegarA(ruta: string) {

    if (ruta == "datos-generales-edicion") {
      this.navCtrl.navigateRoot(ruta)
      return
    }

    if (!this.hayInternet) {
      return;
    }

    let respuesta = await this.webService.getAsync(API.endpoints.validarLicencia + '?client_id=' + this.usuario.id)
    if (respuesta.status == 401) {


      if (respuesta.error.message.includes("realiza una")) {
        localStorage.setItem("opcionAlerta", "eliminar-transferencia")
        const modal = await this.modalController.create({
          component: ModalAlertasCustomPage,
          cssClass: 'transparent-modal',
          componentProps: { mensaje: respuesta.error.message }
        })

        modal.onDidDismiss()
          .then(async (data) => {
            if (data.data) {
              let objeto = {
                client_id: this.usuario.id
              }
              let response = await this.webService.postAsync(API.endpoints.cancelarLicencia, objeto)
              console.log(response)

              this.navCtrl.navigateRoot(ruta);
            }
          })
        await modal.present();
      }

      if (respuesta.error.message.includes("licencia disponible")) {
        localStorage.setItem("opcionAlerta", "intente-el-dia")
        const modal = await this.modalController.create({
          component: ModalAlertasCustomPage,
          cssClass: 'transparent-modal',
          componentProps: { mensaje: respuesta.error.message }
        })
        await modal.present();
      }
    }

    if (respuesta.status == true) {
      this.navCtrl.navigateRoot(ruta);
    }
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async obtenerHistoricoLicencias() {
    let objeto = {
      client_id: this.usuario.id,
      mobile_identifier: await this.utilitiesServices.idTelefono()
    }
    let respuesta = await this.webService.postAsync(API.endpoints.historialLicencias, objeto)
    console.log(respuesta)

    if (respuesta.status == true) {
      for (let i = 0; i < respuesta?.data.length; i++) {
        respuesta.data[i].mes = this.utilitiesServices.obtenerMesStringActual(respuesta.data[i].month_hire)

        if (respuesta.data[i].duration_month > 1) {
          respuesta.data[i].mesFin = Number(respuesta.data[i].month_hire) + (respuesta.data[i].duration_month - 1)
          respuesta.data[i].mesFinString = this.utilitiesServices.obtenerMesStringActual(respuesta.data[i].mesFin)
        }
        if (respuesta.data[i].active == 1 || respuesta.data[i].active == 2) {
          this.licenciaActual.push(respuesta.data[i])
        } else {
          this.historicoLicencias.push(respuesta.data[i])
        }
      }
      console.log("edicion descargada ", this.edicionDescargada)
      for (let i = 0; i < this.licenciaActual.length; i++) {
        if (this.edicionDescargada) {

          // para mensual
          if (this.licenciaActual[i].duration_month == 1) {
            if (this.edicionDescargada.month == this.licenciaActual[i].month_hire) {
              this.licenciaActual[i].edicionDescargada = this.utilitiesServices.obtenerMesStringActual(this.licenciaActual[i].month_hire)
            }
          }

          // para mayor a mensual
          if (this.licenciaActual[i].duration_month > 1) {
            let fin = (this.licenciaActual[i].month_hire + this.licenciaActual[i].duration_month - 1)
            let inicio = this.licenciaActual[i].month_hire;
            let contenido = this.edicionDescargada.month
            console.log("fin ", fin)
            console.log("inicio ", inicio)
            console.log("contenido ", contenido)


            if (contenido >= inicio && contenido <= fin) {
              this.licenciaActual[i].edicionDescargada = this.utilitiesServices.obtenerMesStringActual(this.licenciaActual[i].month_hire)
            }
          }

        }

      }
    }

    if (respuesta?.error?.message == "Unauthenticated.") {
      localStorage.setItem("opcionAlerta", "login-sesion-activa")
      const modal = await this.modalController.create({
        component: ModalAlertasCustomPage,
        cssClass: 'transparent-modal',
        componentProps: { mensaje: "Ya tiene una sesión activa en otro dispositivo, si desea sustituirlo por favor comuníquese a contacto@autometrica.com.mx" }
      })
      await modal.present();
      await this.cerrarSesion();
    }

    // if(respuesta.)

  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async descargarBd(licencia: any) {

    this.networkStatus = (await Network.getStatus()).connected;
    if (!this.networkStatus) {
      return;
    }

    console.log(licencia)

    localStorage.setItem("opcionAlerta", "aviso-borrado-licencias")
    const modal = await this.modalController.create({
      component: ModalAlertasCustomPage,
      cssClass: 'transparent-modal',
      componentProps: { mensaje: "Esta acción borrará cualquier descarga vigente anterior, podrá seguir consultándola en línea." }
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
    this.mostrarCanjear = 0;
    this.mostrarAdquirirLicencia = 0;
    if (respuesta.status == true) {
      for (let i = 0; i < respuesta.paymet_method.length; i++) {
        if ((respuesta.paymet_method[i].id == 2 && respuesta.paymet_method[i].active) ||
          (respuesta.paymet_method[i].id == 3 && respuesta.paymet_method[i].active)) {
          this.mostrarAdquirirLicencia++
        }
        if (respuesta.paymet_method[i].id == 1 && respuesta.paymet_method[i].active) {
          this.mostrarCanjear++;
        }
      }
      return;
    }


  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async handleRefresh(event: any) {
    if ((await Network.getStatus()).connected == true) {
      this.edicionDescargada = JSON.parse(localStorage.getItem('edicionDescargada')!);
      this.licenciaActual = [];
      this.historicoLicencias = [];
      await this.recargar();
      await this.sqliteService.listaModulos$.next(true);
      event.target.complete();
    } else {
      event.target.complete();
    }
  }

  public async cerrarSesion() {
    localStorage.removeItem("usuario");
    localStorage.removeItem("datosPersonales");
    localStorage.removeItem("token");
    localStorage.removeItem("recordarContrasenia");
    this.userService.cerrarSesion();
    await this.navCtrl.navigateRoot('/login');
  }

  public async acomodar() {
    if (this.historicoLicencias.length == 0) return;
    this.acomodoAsc = !this.acomodoAsc;

    if (this.acomodoAsc) {
      this.historicoLicencias.sort((x, y) => x.history_id - y.history_id).reverse();
    } else {
      this.historicoLicencias.sort((x, y) => x.history_id - y.history_id);
    }
  }


}
