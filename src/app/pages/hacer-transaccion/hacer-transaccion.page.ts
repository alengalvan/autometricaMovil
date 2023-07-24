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
    codigo: [null, [Validators.required, Validators.minLength(9)]],
  });
  public mensajesValidacion = {
    codigo: [
      { type: "required", message: "*Campo obligatorio." },
      { type: "minlength", message: "*El código debe tener un mínimo de 8 caracteres." },
    ]
  };
  mes: any;
  anio: any;
  tiposLicencias: any[] = [];
  fechaPeriodo: any;
  licenciaSeleccionadaAutomatica: any;
  get codigo() {
    return this.form.get("codigo");
  }
  public id = this.route.snapshot.paramMap.get('id');
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
    console.log(this.id)

    if (this.id) {
      let respuesta = await this.webRestService.getAsync(API.endpoints.getListado + this.usuario.id)
      
      if (respuesta.status == true) {


        for (let i = 0; i < respuesta?.licenses.length; i++) {
          if(respuesta?.licenses[i].duration_month == 1){
            this.tiposLicencias.push(respuesta?.licenses[i])
          }
        }

        console.log(this.tiposLicencias)
        if(this.tiposLicencias.length == 0){
          this.navCtrl.navigateRoot("mi-perfil");
          return;
        } 

        this.fechaPeriodo = respuesta?.period;
        if (this.fechaPeriodo) {
          this.mes = this.fechaPeriodo[0]?.month_period?.split('-')[1];
          this.anio = this.fechaPeriodo[0]?.month_period?.split('-')[0];
        }

        if (this.mes && this.anio) {
          this.mes = this.utilitiesServices.obtenerMesStringActual(this.mes)
        }

        let hayLicenciasMensuales: number = 0;

        for (let i = 0; i < this.tiposLicencias.length; i++) {
          this.tiposLicencias[i].mes = this.mes;
          this.tiposLicencias[i].anio = this.anio;
          this.tiposLicencias[i].metodosPago = respuesta?.paymet_method;
          this.tiposLicencias[i].mesNumero = this.fechaPeriodo[0]?.month_period?.split('-')[1];

          if (this.tiposLicencias[i].duration_month == 1) {
            hayLicenciasMensuales++;
          }
        }

        for (let i = 0; i < this.tiposLicencias.length; i++) {
          if (hayLicenciasMensuales > 0) {
            if (this.tiposLicencias[i].duration_month == 1) {
              this.licenciaSeleccionadaAutomatica = this.tiposLicencias[i]
            }
          } else {
            this.licenciaSeleccionadaAutomatica = this.tiposLicencias[i]
          }
        }

      } else {
        localStorage.setItem("opcionAlerta", "error-general")
        const modal = await this.modalController.create({
          component: ModalAlertasCustomPage,
          cssClass: 'transparent-modal',
          componentProps: { mensaje: "Error inesperado por favor intente más tarde." }
        })
        this.navCtrl.navigateRoot("mi-perfil")
        await modal.present();
      }
    }
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public reygresar(ruta: string) {
    this.navCtrl.navigateRoot(ruta)
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  
  public async pagarPrepago() {
    if (!this.form.valid) {
      this.utilitiesServices.validaCamposFormulario([this.form]);
      return;
    }

    let objetoPrincipal = {
      code: this.form.controls["codigo"].value.toUpperCase(),
      license_id: this.id ? this.licenciaSeleccionadaAutomatica.id : this.licenciaSeleccionada.id,
      client_id: this.usuario.id,
      month: this.id ? this.licenciaSeleccionadaAutomatica.mesNumero : Number(this.licenciaSeleccionada.mesNumero),
      year: this.id ? this.anio : Number(this.licenciaSeleccionada.anio),
    }

    let respuesta = await this.webRestService.postAsync(API.endpoints.pagarPrepago, objetoPrincipal);

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
    }


    console.log(respuesta)
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
