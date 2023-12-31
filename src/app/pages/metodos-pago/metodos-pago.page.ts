import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ModalController, NavController } from '@ionic/angular';
import { WebRestService } from 'src/app/services/crud-rest.service';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
  selector: 'app-metodos-pago',
  templateUrl: './metodos-pago.page.html',
  styleUrls: ['./metodos-pago.page.scss'],
})
export class MetodosPagoPage implements OnInit {

  public usuario = JSON.parse(localStorage.getItem('usuario')!);
  public licenciaSeleccionada = JSON.parse(localStorage.getItem('licenciaSeleccionada')!);
  
  public tiposFormasPago: any[] = [];

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

    const modal = await this.modalController.getTop();
    if(modal){
      await this.utilitiesServices.cerrarModal();
    }

    this.tiposFormasPago = [];

    if(this.licenciaSeleccionada.prepaid_card == 1){
      this.tiposFormasPago.push(
        {
          id: 1,
          nombre: 'Tarjeta de Prepago',
          desc: 'Si no cuenta con tarjeta de prepago por favor contacte a su vendedor.',
          textoTarjeta: 'Seleccionar Tarjeta'
        }
      )
    }

    if(this.licenciaSeleccionada.credit_card == 1){
      this.tiposFormasPago.push(
        {
          id: 2,
          nombre: 'Tarjeta de Crédito o Débito',
          desc: 'Ingrese la tarjeta de crédito o débito con la que se realizará su pago.',
          textoTarjeta: 'Ingresar Tarjeta'
        }
      )
    }

    if(this.licenciaSeleccionada.transfer == 1){
      this.tiposFormasPago.push(
        {
          id: 3,
          nombre: 'Depósito o Transferencia',
          desc: 'Consulte los datos informativos para realizar su depósito o transferencia.',
          textoTarjeta: 'Datos de depósito o transferencia'
        }
      )
    }
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public reygresar() {
    this.navCtrl.navigateRoot("pagos")
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async irFormaPago(tipo: any){
    let opcion = tipo.id;
    localStorage.setItem("metodoPagoSeleccionado", JSON.stringify(tipo))
    if(opcion == 2){
      this.navCtrl.navigateRoot("administracion-tarjetas")
    }else if(opcion == 3){
      this.navCtrl.navigateRoot("resumencompra-transferencia-prepago/" + opcion)
    }else{
      this.navCtrl.navigateRoot("hacer-transaccion/2")
    }
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async ingresarTarjetas(){
    this.navCtrl.navigateRoot("alta-nueva-tarjeta")
  }

  public async ngOnDestroy() {
    console.log("se destruye")
    let backDrop: any = document.querySelector('ion-backdrop');
    if (backDrop != null) {
      backDrop.click();
    }
  }

}
