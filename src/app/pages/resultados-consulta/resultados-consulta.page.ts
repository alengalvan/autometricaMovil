import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-resultados-consulta',
  templateUrl: './resultados-consulta.page.html',
  styleUrls: ['./resultados-consulta.page.scss'],
})
export class ResultadosConsultaPage implements OnInit {
  public usuario = JSON.parse(localStorage.getItem('usuario')!);
  public resultasOfflineConsulta = JSON.parse(localStorage.getItem('resultadosConsulta')!);
  constructor(public navCtrl: NavController) { }

  public async ngOnInit() {
    console.log(this.resultasOfflineConsulta)
  }

   //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
   public reygresar() {
    this.navCtrl.navigateRoot("consulta-autometrica")
  }

}
