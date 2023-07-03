import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, NavController, NavParams } from '@ionic/angular';
import { API } from 'src/app/endpoints';
import { WebRestService } from 'src/app/services/crud-rest.service';

@Component({
  selector: 'app-modal-alertas-custom',
  templateUrl: './modal-alertas-custom.page.html',
  styleUrls: ['./modal-alertas-custom.page.scss'],
})
export class ModalAlertasCustomPage implements OnInit {

  public objetoRecibido: any = null;
  public mensajeError: any = null;
  public opcionAlerta: any = localStorage.getItem('opcionAlerta')
  public code = localStorage.getItem("code")
  public mensajeInner = "Podrá realizar la descarga más" +
    "<br>" + "tarde en Mi Perfil->Licencias->" +
    "<br>" + "Descargar." +
    "<br>" + "Mientras tanto puede realizar" +
    "<br>" + "consultas en línea.";

  public mensajeInnerDatos = "No está conectado a una red Wifi, por" +
    "<br>" + "lo que se estarán consumiendo sus" +
    "<br>" + "datos." +
    "<br>" + "¿Desea continuar?";

  public mensajeInnerDescargaExitosa = "Información descargada" +
    "<br>" + "exitosamente.";
  public mensajeInnerCompraExitosa = "El pago fue realizado exitosamente." + "<br>" + "Si requiere factura contáctenos.";
  public mensajeInnerYaPuedeConsultar = "¡Ya puede consultar!" +
  "<br>" + "¿Desea descargar la información de" +
  "<br>" + "<<mes año>> para consultas sin" +
  "<br>" + "conexión? Esto borrará cualquier" +
  "<br>" + "descarga vigente anterior. Podrá seguir" + 
  "<br>" + "consultándola en línea."
  public tarjetaSeleccionada = JSON.parse(localStorage.getItem('tarjetaSeleccionada')!);
  public mensajeModalConsulta = localStorage.getItem('mensaje-modal-consulta');

  public formPago: FormGroup = this.formBuilder.group({
    cvv: [null, Validators.required],
  });

  get cvv() {
    return this.formPago.get("cvv");
  }

  public mensajesValidacionPago = {
    cvv: [
      { type: "required", message: "*Ingrese el CVV." },
    ]
  };

  constructor(public modalController: ModalController,
    navParams: NavParams,
    public webRestService: WebRestService,
    private formBuilder: FormBuilder,
    public navCtrl: NavController) {
    this.mensajeError = navParams.data['mensaje'];
  }

  public async ngOnInit() {
    // await this.cerrarPorTiempo();
  }

  public dissmiss(acepto?: boolean) {
    this.modalController.dismiss(acepto)
  }

  public async cerrarPorTiempo() {
    setTimeout(() => {
      this.modalController.dismiss()
    }, 3000);
  }

  public cerrarModal(valor?: any) {
    this.modalController.dismiss(valor);
  }

  public cerrarModalReturnData(data: any) {
    this.modalController.dismiss(data);
  }

  public async reenviarCorreo() {
    let objeto = {
      email: localStorage.getItem("correoVerificar")
    }
    let respuesta = await this.webRestService.postAsync(API.endpoints.reenviarCorreo, objeto)
    console.log(respuesta)
    this.cerrarModal()
  }

  public async canjearAdquirir(){
    if(this.mensajeModalConsulta == 'Adquirir Licencia'){
      this.navCtrl.navigateRoot("pagos");
    }else{
      this.navCtrl.navigateRoot("hacer-transaccion");
    }

  }


}
