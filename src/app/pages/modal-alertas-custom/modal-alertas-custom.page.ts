import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, NavController, NavParams } from '@ionic/angular';
import { API } from 'src/app/endpoints';
import { WebRestService } from 'src/app/services/crud-rest.service';
import { UtilitiesService } from 'src/app/services/utilities.service';

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
  public mensajeKMVacio = "Kilometraje vacío" +
  "<br><br>" + "Si no proporciona el kilometraje, se" +
  "<br>" + "se tomará en cuenta el kilometraje" +
  "<br>" + "promedio para ese año."
  public sinInternetSinDescarga = "Para poder consultar información" +
  "<br>" + "es necesario descargar la edición o" +
  "<br>" + "contar con acceso a internet."

  // Si no proporciona el kilometraje,  promedio para ese año.
  public tarjetaSeleccionada = JSON.parse(localStorage.getItem('tarjetaSeleccionada')!);
  public mensajeModalConsulta = localStorage.getItem('mensaje-modal-consulta');
  public primeraLicencia = JSON.parse(localStorage.getItem('primeraLicencia')!)
  public segundaLicencia = JSON.parse(localStorage.getItem('segundaLicencia')!)
  public formPago: FormGroup = this.formBuilder.group({
    cvv: [null,  [Validators.required, Validators.minLength(3), Validators.pattern("[0-9]+$"), Validators.maxLength(4)]],
  });

  get cvv() {
    return this.formPago.get("cvv");
  }

  public mensajesValidacionPago = {
    cvv: [
      { type: "required", message: "*Ingrese el CVV." },
      { type: "minlength", message: "*El cvv debe tener un mínimo de 3 caracteres." },
      { type: "maxlength", message: "*El cvv debe tener un máximo de 4 caracteres." },
      { type: "pattern", message: "*El cvv solo acepta números" },
    ]
  };

  constructor(public modalController: ModalController,
    navParams: NavParams,
    public webRestService: WebRestService,
    private formBuilder: FormBuilder,
    public navCtrl: NavController,
    public utilitiesService: UtilitiesService) {
    this.mensajeError = navParams.data['mensaje'];
  }

  public async ngOnInit() {
    console.log(this.primeraLicencia)
    console.log(this.segundaLicencia)
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
    this.cerrarModal()
    if(this.mensajeModalConsulta == 'Adquirir Licencia'){
      this.navCtrl.navigateRoot("pagos");
    }else{
      this.navCtrl.navigateRoot("hacer-transaccion/1");
    }

  }

  public async cerrarModalReturnDataForm(data: any){
    
    await this.utilitiesService.validaCamposFormulario([this.formPago])
    console.log(this.formPago.controls['cvv'].value)

    if(this.formPago.controls['cvv'].value == null || this.formPago.controls['cvv'].value == ''){
      return;
    }

    if(String(this.formPago.controls['cvv'].value).length >= 3 && String(this.formPago.controls['cvv'].value).length <= 4){
      console.log("si")
      this.modalController.dismiss(data);
    }else{
      console.log("no")
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
