import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
  selector: 'app-resultados-consulta',
  templateUrl: './resultados-consulta.page.html',
  styleUrls: ['./resultados-consulta.page.scss'],
})
export class ResultadosConsultaPage implements OnInit {
  public usuario = JSON.parse(localStorage.getItem('usuario')!);
  public resultasCarsConsulta = JSON.parse(localStorage.getItem('resultadosCars')!);
  public resultadosAnadir = JSON.parse(localStorage.getItem('resultadosAñadir')!);
  public resultadosKilometraje = JSON.parse(localStorage.getItem('resultadosKilometraje')!);
  public busquedaAutometrica = JSON.parse(localStorage.getItem('busquedaAutometrica')!);
  mes: string = ''
  constructor(public navCtrl: NavController,
    public utilitiesService: UtilitiesService) { }

  public async ngOnInit() {
    await this.mesString()
    console.log(this.resultasCarsConsulta)
    console.log(this.resultadosAnadir)
    console.log(this.resultadosKilometraje)
    console.log(this.busquedaAutometrica)
  }

   //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
   public reygresar() {
    this.navCtrl.navigateRoot("consulta-autometrica")
  }

  public async mesString(){
    this.mes = await this.utilitiesService.numeroAMes(this.busquedaAutometrica.mes)
  }
}
