import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, NavController } from '@ionic/angular';
import { API } from 'src/app/endpoints';
import { WebRestService } from 'src/app/services/crud-rest.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { ModalAlertasCustomPage } from '../modal-alertas-custom/modal-alertas-custom.page';

@Component({
  selector: 'app-pagos',
  templateUrl: './pagos.page.html',
  styleUrls: ['./pagos.page.scss'],
})
export class PagosPage implements OnInit {

  public pasoPago: number = 1;
  public tiposLicencias: any[] = [];
  public fechaPeriodo: any = null;
  public mes: any = null;
  public anio: any = null;
  public tiposFormasPago: any[] = [];
  public tarjetasGuardadas: any[] = [
    {
      nombre: 'Visa (3338)',
      desc: 'Tarjeta de crédito visa 3338',
    },
    {
      nombre: 'Visa (0878)',
      desc: 'Tarjeta de crédito visa 0878',
    }
  ];
  public tipoLicenciaSeleccionada: any = null;
  public metodoPago: any = null;
  public tarjetaSeleccionada: any = null;
  public abiertoOtraTarjeta: boolean = false;
  public usuario = JSON.parse(localStorage.getItem('usuario')!);
  public form: FormGroup = this.formBuilder.group({
    // codigo1: [null, [Validators.required, Validators.minLength(15)] ],
    // codigo2: [null, [Validators.required, Validators.minLength(15)]],
    codigo1: [null, [Validators.required]],
    codigo2: [null, [Validators.required]],
  });
  public mensajesValidacion = {
    codigo1: [
      { type: "required", message: "*Campo Obligatorio" },
      { type: "minlength", message: "*Ingrese los 15 digitos" },

    ],
    codigo2: [
      { type: "required", message: "*Campo Obligatorio" },
      { type: "minlength", message: "*Ingrese los 15 digitos" },

    ]
  };
  get codigo1() {
    return this.form.get("codigo1");
  }
  get codigo2() {
    return this.form.get("codigo2");
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  constructor(private navCtrl: NavController,
    private formBuilder: FormBuilder,
    public utilitiesServices: UtilitiesService,
    public webRestService: WebRestService,
    public modalController: ModalController) { }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async ngOnInit() {
    if(!this.usuario){
      this.navCtrl.navigateRoot("login");
      return
    }
    
    let respuesta = await this.webRestService.getAsync(API.endpoints.getListado + this.usuario.id)
    if (respuesta.status == true) {
      this.tiposLicencias = [];
      respuesta?.period.forEach((periodo: any) => {
        let mes = periodo.month_period?.split('-')[1];
        let anio = periodo.month_period?.split('-')[0];
        mes = this.utilitiesServices.obtenerMesStringActual(mes)
        respuesta?.licenses.forEach((licencia: any) => {
          let objeto = {
            mes: mes,
            anio: anio,
            licencia: licencia,
            mesNumero: periodo.month_period?.split('-')[1],
            mesFin: 0,
            mesFinString: ""
          }

          if (objeto.licencia.duration_month > 1) {
            objeto.mesFin = Number(objeto.mesNumero) + (objeto.licencia.duration_month - 1)
            objeto.mesFinString = this.utilitiesServices.obtenerMesStringActual(objeto.mesFin)
          }

          let objeto2 = {
            active: objeto.licencia.active,
            created_at: objeto.licencia.created_at,
            credit_card: objeto.licencia.credit_card,
            duration_month: objeto.licencia.duration_month,
            id: objeto.licencia.id,
            name: objeto.licencia.name,
            prepaid_card: objeto.licencia.prepaid_card,
            price: objeto.licencia.price,
            transfer: objeto.licencia.transfer,
            updated_at: objeto.licencia.updated_at,
            user_id: objeto.licencia.user_id,
            mesNumero: objeto.mesNumero,
            mes: objeto.mes,
            anio: objeto.anio,
            mesFin: objeto.mesFin,
            mesFinString: objeto.mesFinString
          }
          console.log(objeto2)
          this.tiposLicencias.push(objeto2)
        });
      });

    } else {
      localStorage.setItem("opcionAlerta", "error-general")
      const modal = await this.modalController.create({
        component: ModalAlertasCustomPage,
        cssClass: 'transparent-modal',
        componentProps: { mensaje: respuesta.error.message }
      })
      this.navCtrl.navigateRoot("mi-perfil")
      await modal.present();
    }


  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async irMetodosPago(item?: any) {
    localStorage.setItem("licenciaSeleccionada", JSON.stringify(item))
    this.navCtrl.navigateRoot("metodos-pago");
    console.log(JSON.parse(localStorage.getItem('licenciaSeleccionada')!))
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public reygresar() {
    this.pasoPago--
    if (this.pasoPago == 0) {
      this.navegarA('mi-perfil')
    }
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public navegarA(ruta: string) {
    this.navCtrl.navigateRoot(ruta);
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async procesarPago(tipo: number) {
    if (tipo == 1) {

    }
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async cancelarPago() {
    this.pasoPago--;
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async pagar() {
    console.log(this.tipoLicenciaSeleccionada)
    console.log(this.metodoPago)

    if (this.metodoPago.id == 1) {
      if (!this.form.valid) {
        this.utilitiesServices.validaCamposFormulario([this.form])
      }

      console.log(this.fechaPeriodo[0].month_period.split('-'))

      let mes = this.fechaPeriodo[0].month_period.split('-')[1];
      let anio = this.fechaPeriodo[0].month_period.split('-')[0];

      let objeto = {
        code1: this.form.controls['codigo1'].value,
        code2: this.form.controls['codigo2'].value,
        license_id: this.tipoLicenciaSeleccionada.id,
        client_id: this.usuario.id,
        month: Number(mes),
        year: Number(anio)
      }

      let respuesta = await this.webRestService.postAsync(API.endpoints.contratarLicenciaTarjeta, objeto);
      console.log(respuesta)

      if (respuesta.status) {
        await this.utilitiesServices.alert("", 'Pago exitoso')
      } else {
        await this.utilitiesServices.alert("", 'El pago no logro completarse')
      }

    }


  }
}
