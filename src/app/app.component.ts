import { Component, NgZone } from '@angular/core';
import { MenuController, ModalController, NavController, Platform } from '@ionic/angular';
import { UtilitiesService } from './services/utilities.service';
import { Router } from '@angular/router';
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { ModalAlertasCustomPage } from './pages/modal-alertas-custom/modal-alertas-custom.page';
import { WebRestService } from './services/crud-rest.service';
import { API } from './endpoints';
import { Capacitor } from '@capacitor/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { LoginPage } from './pages/login/login.page';
import { UserService } from './services/user.service';
import { Device } from '@capacitor/device';
import { Network, ConnectionStatus } from '@capacitor/network'

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  public pages: any = [];
  public usuario = JSON.parse(localStorage.getItem('usuario')!);
  public licenciaActiva: boolean = false;
  public mostrarAdquirirLicencia: boolean = false;
  public mostrarCanjear: boolean = false;
  
  public isWeb: boolean = false;
  public haySesion: boolean = false;
  userChangedSubscription: Subscription | undefined;
  hayInternet: boolean = false;
  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  constructor(private navCtrl: NavController,
    public utilitiesService: UtilitiesService,
    private router: Router, private zone: NgZone,
    public modalController: ModalController,
    public platform: Platform,
    public webService: WebRestService,
    public userService: UserService,
    private menu: MenuController) {
    this.initializeApp();
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async navegarMenu(ruta: string) {
    //: Consulta, Mi Perfil, Canjear Código o Adquirir Licencia
    let usuario = JSON.parse(localStorage.getItem('usuario')!);
    if (usuario == null) {

      if (ruta == "glosario") {
        this.hayInternet = (await Network.getStatus()).connected;
        if (this.hayInternet) {
          this.navCtrl.navigateRoot("glosario/1");
          return;
        } else {
          this.navCtrl.navigateRoot("glosario/2");
          console.log("no tiene internet")
          return;
        }
      }

      switch (ruta) {
        case 'mi-perfil':
          this.openAlerta()
          break;

        case 'consulta-autometrica':
          this.openAlerta()
          break;

        case 'hacer-transaccion/1':
          this.openAlerta()
          break;

        case 'pagos':
          this.openAlerta()
          break;

        case 'hacer-transaccion':
          this.openAlerta()
          break;

        default:
          this.navCtrl.navigateRoot(ruta);
          break;
      }
    } else {
      if (ruta == 'consulta-autometrica') {
        await this.obtenerHistoricoLicencias();
        if (this.licenciaActiva) {
          this.navCtrl.navigateRoot(ruta);
        } else {
          let respuesta = await this.webService.getAsync(API.endpoints.getListado + usuario.id)
          console.log(respuesta)
          if (respuesta.status == true) {
            let hayTarjetaTransferencia: boolean = false;
            let hayPrepago: boolean = false;


            for (let i = 0; i < respuesta.paymet_method.length; i++) {
              if (respuesta.paymet_method[i].id == 2 || respuesta.paymet_method[i].id == 3) {
                hayTarjetaTransferencia = true;
              }

              if (respuesta.paymet_method[i].id == 1) {
                hayPrepago = true;
              }
            }

            let mensaje = hayTarjetaTransferencia ? "Adquirir Licencia" : "Canjear Código";
            localStorage.setItem("mensaje-modal-consulta", mensaje)

            localStorage.setItem("opcionAlerta", "no-tiene-licencia-activa")
            const modal = await this.modalController.create({
              component: ModalAlertasCustomPage,
              cssClass: 'transparent-modal',
            })
            await modal.present();
            return;
          }

          console.log("no hay licencia activa");
          return;
        }
        return;
      }

      if (ruta == "terminos-condiciones") {
        this.hayInternet = (await Network.getStatus()).connected;
        if (this.hayInternet) {
          this.navCtrl.navigateRoot(ruta);
          return;
        } else {
          console.log("no tiene internet")
          return;
        }
      }
      if (ruta == "glosario") {
        this.hayInternet = (await Network.getStatus()).connected;
        if (this.hayInternet) {
          this.navCtrl.navigateRoot("glosario/1");
          return;
        } else {
          this.navCtrl.navigateRoot("glosario/2");
          console.log("no tiene internet")
          return;
        }
      }
      console.log("salio")
      this.navCtrl.navigateRoot(ruta);
    }
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async obtenerHistoricoLicencias() {
    this.licenciaActiva = false;
    let objeto = {
      client_id: JSON.parse(localStorage.getItem('usuario')!).id,
      // mobile_identifier: "c06c7c5f8b043518",
      mobile_identifier: (await Device.getId()).identifier
    }
    let respuesta = await this.webService.postAsync(API.endpoints.historialLicencias, objeto)
    console.log(respuesta)

    if (respuesta.status == true) {
      for (let i = 0; i < respuesta?.data.length; i++) {
        if (respuesta.data[i].active == 1) {
          this.licenciaActiva = true;
        }
      }
    }
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async ngOnInit() {

    this.haySesion = JSON.parse(localStorage.getItem('usuario')!) ? true : false;
    console.log(this.haySesion);

    this.userChangedSubscription = this.userService.sesionActivaObs$.subscribe((valor) => {
      console.log("valor sesion")
      this.haySesion = valor
    })


    await this.validarTransferencia();
    this.pages = [
      {
        title: 'Mi perfil',
        url: 'mi-perfil',
        icon: 'assets/icon/menu-perfil.svg'
      },
      {
        title: '¿Quiénes somos?',
        url: 'quienes-somos',
        icon: 'assets/icon/carbon_book.svg'
      },
      {
        title: 'Consulta',
        url: 'consulta-autometrica',
        icon: 'assets/icon/menu-consulta.svg'
      },
      {
        title: 'Glosario y Kilometraje',
        url: 'glosario',
        icon: 'assets/icon/a.svg'
      },
      {
        title: 'Contacto',
        url: 'contactanos',
        icon: 'assets/icon/menu-contacto.svg'
      },

    ];

    if (this.mostrarAdquirirLicencia) {
      let indice = 3;
      let objeto =
      {
        title: 'Adquirir Licencia',
        url: 'pagos',
        icon: 'assets/icon/adquirir_licencia.svg'
      }
      this.insertar(indice, objeto)
    }

    if(this.mostrarCanjear){
      let indice = 3;
      let objeto = {
        title: 'Canjear Código',
        url: 'hacer-transaccion/1',
        icon: 'assets/icon/canjear_codigo.svg'
      }
      
      this.insertar(indice, objeto)
     
    }
    await this.utilitiesService.obtenerInfo();
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public insertar(index: any, item: any) {
    this.pages.splice(index, 0, item);
  };

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  initializeApp() {
    App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
      this.zone.run(async () => {

        if (event.url.includes('restablecer')) {
          localStorage.setItem("datosRedireccionamiento", event.url)
          this.navCtrl.navigateRoot("restablecer-contrasenia");
        }

        if (event.url.includes('validar')) {

          let correo = event.url.split("/")[4];
          let objeto = {
            email: correo
          }
          let respuesta = await this.webService.postAsync(API.endpoints.verificarCuenta, objeto)
          console.log(respuesta)

          if (respuesta.status == true) {
            localStorage.setItem("opcionPopup", "2")
            this.navCtrl.navigateRoot("poppups");
          } else {
            localStorage.setItem("opcionAlerta", "usuario-inactivo")
            const modal = await this.modalController.create({
              component: ModalAlertasCustomPage,
              cssClass: 'transparent-modal',
              componentProps: { mensaje: "Error inesperado por favor intente más tarde" }
            })
            await modal.present();
          }
        }

        if (event.url.includes('login')) {
          this.navCtrl.navigateRoot("login");
        }

      });
    });
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async cerrarSesion() {

    localStorage.clear();
    this.userService.cerrarSesion();
    await this.navCtrl.navigateRoot('/login');
    setTimeout(() => {
      this.menu.close();
    }, 1000);
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async openAlerta() {
    localStorage.setItem("opcionAlerta", "menu-opciones-no-permitidas")
    const modal = await this.modalController.create({
      component: ModalAlertasCustomPage,
      cssClass: 'transparent-modal',
    })
    modal.onDidDismiss()
      .then(async () => {
        await this.navCtrl.navigateRoot('/login');
      });
    await modal.present();
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
        if (respuesta.paymet_method[i].id == 1) {
          this.mostrarCanjear = true;
        }
      }
      return;
    }


  }
}
