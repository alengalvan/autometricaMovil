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
  public hayInternet = this.route.snapshot.paramMap.get('id');
  public sinLinea: any = [];

  public autosNuevos: any = [];
  public lineasNuevas: any = [];
  public cambioLinea: any = [];
  public lineaAnterior: any = [];
  public autosNoNuevos: any = [];

  public hayVenta: number = 0;
  public hayCompra: number = 0;
  public hayKilometraje: string = localStorage.getItem('kilometraje')!;

  constructor(public navCtrl: NavController,
    public utilitiesService: UtilitiesService,
    private route: ActivatedRoute) { }

  public async ngOnInit() {

    console.log(this.hayKilometraje)

    if (this.hayInternet) {
      await this.acomodarDatos()
    } else {
      this.resultasCarsConsulta = JSON.parse(localStorage.getItem('resultadosConsulta')!);
      await this.ordenarPorLineas();
    }

  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public reygresar(ruta: string) {
    this.navCtrl.navigateRoot(ruta)
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

    await this.ordenarPorLineas();
  }

  public async ordenarPorLineas() {
    // separamos por tipos de lineas
    for (let i = 0; i < this.resultasCarsConsulta.length; i++) {
      if (this.resultasCarsConsulta[i].name.includes("(cambio de línea)")) {
        this.cambioLinea.push(this.resultasCarsConsulta[i])
      }

      if (this.resultasCarsConsulta[i].name.includes("(línea anterior)")) {
        this.lineaAnterior.push(this.resultasCarsConsulta[i])
      }

      if (this.resultasCarsConsulta[i].name.includes("(línea nueva)")) {
        this.lineasNuevas.push(this.resultasCarsConsulta[i])
      }

      if (!this.resultasCarsConsulta[i].name.includes("(cambio de línea)")
        && !this.resultasCarsConsulta[i].name.includes("(línea anterior)")
          && !this.resultasCarsConsulta[i].name.includes("(línea nueva)")) {
        this.sinLinea.push(this.resultasCarsConsulta[i])
      }

    }


    await this.revisarSiEsNuevo(this.cambioLinea, 1)
    await this.revisarSiEsNuevo(this.lineaAnterior, 2)
    await this.revisarSiEsNuevo(this.lineasNuevas, 3)
    await this.revisarSiEsNuevo(this.sinLinea, 4)


    console.log(this.lineasNuevas)
    console.log(this.cambioLinea)
    console.log(this.lineaAnterior)
    console.log(this.sinLinea)

  }

  public async revisarSiEsNuevo(array: any, tipo: number) {
    console.log(tipo)
    console.log(array)
    // 1.- cambioLinea, 2.- lineaAnterior, 3.-lineasNuevas, 4.- sinLinea
    // primero validamos que la linea tenga compra y venta
    let hayLineaAutoNuevo = 0;
    for (let i = 0; i < array.length; i++) {
      for (let j = 0; j < array[i].list.length; j++) {
        if (array[i].list[j].sale == "" || array[i].list[j].purchase == "") {
          hayLineaAutoNuevo++;
        }
      }
    }

    //cambio de linea
    if (tipo == 1 && hayLineaAutoNuevo > 0) {
      this.cambioLinea = [];
    }
    if (tipo == 1 && hayLineaAutoNuevo == 0) {
      this.cambioLinea = array;
    }

    //Linea anterior
    if (tipo == 2 && hayLineaAutoNuevo > 0) {
      this.lineaAnterior = [];
    }
    if (tipo == 2 && hayLineaAutoNuevo == 0) {
      this.lineaAnterior = array;
    }

    //Linea nueva
    if (tipo == 3 && hayLineaAutoNuevo > 0) {
      this.lineasNuevas = [];
    }
    if (tipo == 3 && hayLineaAutoNuevo == 0) {
      this.lineasNuevas = array;
    }

    //Linea nueva
    if (tipo == 4 && hayLineaAutoNuevo > 0) {
      this.autosNuevos = [];
    }
    if (tipo == 4 && hayLineaAutoNuevo == 0) {
      this.autosNoNuevos = array;
    }

    // Sin linea

    if (hayLineaAutoNuevo > 0) {
      for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array[i].list.length; j++) {
          if (array[i].list[j].sale != "") {
            this.hayVenta++
          }
          if (array[i].list[j].purchase != "") {
            this.hayCompra++
          }
        }
      }
      this.autosNuevos = array;
    }
  }


}
