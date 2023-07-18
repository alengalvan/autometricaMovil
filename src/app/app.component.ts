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
import { sqliteService } from './services/sqlite.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  public pages: any = [];
  // public usuario = JSON.parse(localStorage.getItem('usuario')!);
  public licenciaActiva: number = 0;
  public mostrarAdquirirLicencia: number = 0;
  public mostrarCanjear: number = 0;
  public mensajeNavegacionConsultaError: string = ''

  public isWeb: boolean = false;
  public haySesion: boolean = false;
  userChangedSubscription: Subscription | undefined;
  hayInternet: boolean = false;
  pagesChangedSubscription: Subscription | undefined;
  public cuantasLicenciasTenemosActivas: number = 0;

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  constructor(private navCtrl: NavController,
    public utilitiesService: UtilitiesService,
    private router: Router, private zone: NgZone,
    public modalController: ModalController,
    public platform: Platform,
    public webService: WebRestService,
    public userService: UserService,
    private menu: MenuController,
    public sqliteService: sqliteService) {
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

        if ((await Network.getStatus()).connected == true) {
          await this.obtenerHistoricoLicencias();

          if (this.licenciaActiva == 1) {
            this.navCtrl.navigateRoot("consulta-autometrica/1");
          }

          if (this.licenciaActiva == 2) {
            localStorage.setItem("opcionAlerta", "eliminar-transferencia")
            const modal = await this.modalController.create({
              component: ModalAlertasCustomPage,
              cssClass: 'transparent-modal',
              componentProps: { mensaje: this.mensajeNavegacionConsultaError }
            })

            modal.onDidDismiss()
              .then(async (data) => {
                if (data.data) {
                  let objeto = {
                    client_id: JSON.parse(localStorage.getItem('usuario')!).id
                  }
                  let response = await this.webService.postAsync(API.endpoints.cancelarLicencia, objeto)
                  await this.validarTransferencia();
                  let mensaje = this.mostrarAdquirirLicencia > 0 ? "Adquirir Licencia" : "Canjear Código";
                  localStorage.setItem("mensaje-modal-consulta", mensaje)
                  localStorage.setItem("opcionAlerta", "no-tiene-licencia-activa")
                  const modal = await this.modalController.create({
                    component: ModalAlertasCustomPage,
                    cssClass: 'transparent-modal',
                  })
                  await modal.present();
                }
              })
            await modal.present();

          }

          if (this.licenciaActiva == 3) {
            await this.revisarCuantasLicenciasTenemos();
            

            if (this.cuantasLicenciasTenemosActivas > 0) {
              this.navCtrl.navigateRoot("consulta-autometrica/1");
            } else {
              await this.validarTransferencia();
              let mensaje = this.mostrarAdquirirLicencia > 0 ? "Adquirir Licencia" : "Canjear Código";
              localStorage.setItem("mensaje-modal-consulta", mensaje)
              localStorage.setItem("opcionAlerta", "no-tiene-licencia-activa")
              const modal = await this.modalController.create({
                component: ModalAlertasCustomPage,
                cssClass: 'transparent-modal',
              })
              await modal.present();
            }
          }

        } else {
          // validaciones para consulta sin internet
          let lineas = JSON.parse(localStorage.getItem('lineas')!)
          if (!lineas) {
            localStorage.setItem("opcionAlerta", "sin-internet-sin-datos-descargados")
            const modal = await this.modalController.create({
              component: ModalAlertasCustomPage,
              cssClass: 'transparent-modal',
              componentProps: { mensaje: "" }
            })
            await modal.present();
          } else {
            this.navCtrl.navigateRoot("consulta-autometrica")
          }

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

      if (ruta == "hacer-transaccion/1") {

        let hayInternet = (await Network.getStatus()).connected;
        if (hayInternet == false) return;

        let respuesta = await this.webService.getAsync(API.endpoints.validarLicencia + '?client_id=' + JSON.parse(localStorage.getItem('usuario')!).id);
        console.log(respuesta);


        if (respuesta.status == false || respuesta.status == 401) {

          // licencia pendiente
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
                    client_id: JSON.parse(localStorage.getItem('usuario')!).id
                  }
                  let response = await this.webService.postAsync(API.endpoints.cancelarLicencia, objeto)
                  console.log(response)

                  this.navCtrl.navigateRoot(ruta);
                }
              })
            await modal.present();
          }

          // licencia activa
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
          this.navCtrl.navigateRoot(ruta)
        }


        return;
      }

      if (ruta == "pagos") {
        let hayInternet = (await Network.getStatus()).connected;
        if (hayInternet == false) return;

        let respuesta = await this.webService.getAsync(API.endpoints.validarLicencia + '?client_id=' + JSON.parse(localStorage.getItem('usuario')!).id);
        console.log(respuesta);
        if (respuesta.status == false || respuesta.status == 401) {

          // licencia pendiente
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
                    client_id: JSON.parse(localStorage.getItem('usuario')!).id
                  }
                  let response = await this.webService.postAsync(API.endpoints.cancelarLicencia, objeto)
                  console.log(response)

                  this.navCtrl.navigateRoot(ruta);
                }
              })
            await modal.present();
          }

          // licencia activa
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
          this.navCtrl.navigateRoot(ruta)
        }
        return;
      }
      this.navCtrl.navigateRoot(ruta);
    }
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async obtenerHistoricoLicencias() {
    this.mensajeNavegacionConsultaError = "";
    let respuesta = await this.webService.getAsync(API.endpoints.validarLicencia + '?client_id=' + JSON.parse(localStorage.getItem('usuario')!).id);
    console.log(respuesta);
    if (respuesta.status == false || respuesta.status == 401) {
      // licencia pendiente
      if (respuesta.error.message.includes("realiza una")) {
        this.mensajeNavegacionConsultaError = respuesta.error.message;
        this.licenciaActiva = 2;
      }

      if (respuesta.error.message.includes("licencia disponibl")) {
        this.mensajeNavegacionConsultaError = respuesta.error.message;
        this.licenciaActiva = 1;
      }
    }

    if (respuesta.status == true) {
      this.licenciaActiva = 3;
    }
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async ngOnInit() {

    this.haySesion = JSON.parse(localStorage.getItem('usuario')!) ? true : false;
    console.log("tenemos una sesion activa ", this.haySesion);

    this.userChangedSubscription = this.userService.sesionActivaObs$.subscribe((valor) => {
      console.log("valor sesion ", valor)
      this.haySesion = valor
    })

    this.pagesChangedSubscription = await this.sqliteService.listaModulos$.subscribe(async (valor) => {
      console.log("vamos a actualizar")
      await this.ordenarMenu();
    })

    await this.utilitiesService.obtenerInfo();
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async ordenarMenu() {
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

    if (this.mostrarAdquirirLicencia > 0) {
      let indice = 3;
      let objeto =
      {
        title: 'Adquirir Licencia',
        url: 'pagos',
        icon: 'assets/icon/adquirir_licencia.svg'
      }
      this.insertar(indice, objeto)
    }

    if (this.mostrarCanjear > 0) {
      let indice = 3;
      let objeto = {
        title: 'Canjear Código',
        url: 'hacer-transaccion/1',
        icon: 'assets/icon/canjear_codigo.svg'
      }

      this.insertar(indice, objeto)

    }
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

    localStorage.removeItem("usuario");
    localStorage.removeItem("datosPersonales");
    localStorage.removeItem("token");
    localStorage.removeItem("recordarContrasenia");

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
    console.log(this.mostrarAdquirirLicencia)
    console.log(this.mostrarCanjear)
    this.mostrarAdquirirLicencia = 0;
    this.mostrarCanjear = 0;
    let respuesta = await this.webService.getAsync(API.endpoints.validarMetodosPagos)
    console.log(respuesta)
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
  public async revisarCuantasLicenciasTenemos() {
    this.cuantasLicenciasTenemosActivas = 0;
    let usuario = JSON.parse(localStorage.getItem('usuario')!);
    let objeto = {
      client_id: usuario.id,
      mobile_identifier: await this.utilitiesService.idTelefono()
    }
    let respuesta = await this.webService.postAsync(API.endpoints.historialLicencias, objeto)
    console.log(respuesta)

    if (respuesta.status == true) {
      for (let i = 0; i < respuesta!.data!.length; i++) {
        if (respuesta.data[i].active == 1) {
          this.cuantasLicenciasTenemosActivas++
        }
      }

    }

  }
}
