import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  public licenciaConsulta = JSON.parse(localStorage.getItem('licenciaConsulta')!);
  mes: string = '';
  public hayInternet = this.route.snapshot.paramMap.get('id');
  constructor(public navCtrl: NavController,
    public utilitiesService: UtilitiesService,
    private route: ActivatedRoute) { }

  public async ngOnInit() {
    await this.mesString()
    console.log(this.resultasCarsConsulta)
    console.log(this.resultadosAnadir)
    console.log(this.resultadosKilometraje)
    console.log(this.busquedaAutometrica)
    console.log(this.licenciaConsulta)
    await this.acomodarDatos()
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public reygresar(ruta: string) {
    this.navCtrl.navigateRoot(ruta)
  }
  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async mesString() {
    this.mes = await this.utilitiesService.numeroAMes(this.busquedaAutometrica.mes)
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async acomodarDatos() {
    for (let i = 0; i < this.resultasCarsConsulta.length; i++) {
      let anadires = [];
      for (let k = 0; k < this.resultadosAnadir.length; k++) {
        if (this.resultasCarsConsulta[i].name == this.resultadosAnadir[k].subbrand) {
          anadires.push(this.resultadosAnadir[k])
        }
      }
      this.resultasCarsConsulta[i].anadires = anadires;
    }


    // acomodar kilometraje 
    for (let j = 0; j < this.resultasCarsConsulta.length; j++) {
      let kilometraje = [];
      for (let k = 0; k < this.resultasCarsConsulta[j].list.length; k++) {
        for (let l = 0; l < this.resultadosKilometraje.length; l++) {
          if (this.resultasCarsConsulta[j].list[k].km_group == this.resultadosKilometraje[l].grupo) {
            kilometraje.push(this.resultadosKilometraje[l])
          }
        }
      }
      this.resultasCarsConsulta[j].kilometraje = kilometraje;
    }

    // en caso de que existan
    for (let i = 0; i < this.resultasCarsConsulta.length; i++) {
      let hash: any = {};
      this.resultasCarsConsulta[i].kilometraje = 
      this.resultasCarsConsulta[i].kilometraje.filter((o: any) => hash[o.grupo] ? false : hash[o.grupo] = true);
    }



    console.log(this.resultasCarsConsulta)
  }


}
