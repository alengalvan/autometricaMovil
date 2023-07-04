import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, NavController } from '@ionic/angular';
import { API } from 'src/app/endpoints';
import { WebRestService } from 'src/app/services/crud-rest.service';
import { sqliteService } from 'src/app/services/sqlite.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { Network, ConnectionStatus } from '@capacitor/network'
import { ModalAlertasCustomPage } from '../modal-alertas-custom/modal-alertas-custom.page';
@Component({
  selector: 'app-consulta-autometrica',
  templateUrl: './consulta-autometrica.page.html',
  styleUrls: ['./consulta-autometrica.page.scss'],
})
export class ConsultaAutometricaPage implements OnInit {
  public obtenerTodasLineas: any = [];
  public obtenerTodasMillas: any = [];
  public obtenerTodasImagenes: any = [];
  public marcasOffline: any = [];
  public aniosOffline: any = [];
  public subMarcasOffline: any = [];
  public marcasOnline: any = [];
  public aniosOnline: any = [];
  public subMarcasOnline: any = [];
  public respuestaBusquedaOffline: any = [];
  public networkStatus: ConnectionStatus | undefined;
  public usuario = JSON.parse(localStorage.getItem('usuario')!);
  public form: FormGroup = this.formBuilder.group({
    marca: [null, [Validators.required]],
    submarca: [null, [Validators.required]],
    anio: [null, [Validators.required]],
    kilometraje: [null],
  });

  get marca() {
    return this.form.get("marca");
  }

  get submarca() {
    return this.form.get("submarca");
  }

  get anio() {
    return this.form.get("anio");
  }

  get kilometraje() {
    return this.form.get("kilometraje");
  }

  public mensajesValidacion = {
    marca: [
      { type: "required", message: "*Seleccione la marca." },
    ],
    submarca: [
      { type: "required", message: "*Seleccione la submarca." },
    ],
    anio: [
      { type: "required", message: "*Seleccione el año." },
    ],
    kilometraje: [
      { type: "required", message: "Ingrese el kilometraje." },
    ]
  };

  public estados: any = [];
  hayInternet: any = null
  constructor(private formBuilder: FormBuilder,
    public utilitiesService: UtilitiesService,
    public sqliteService: sqliteService,
    public webRestService: WebRestService,
    public navCtrl: NavController,
    public modalController: ModalController) { }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  async ngOnInit() {

    this.hayInternet = (await Network.getStatus()).connected;
    if (this.hayInternet) {
      await this.obtenerMarcasOnline();
    } else {

      // no ha descargado
      await this.obtenerListadoMarcas();
      await this.obtenerMarcasOffline()
      if (this.obtenerTodasLineas.length == 0) {
        localStorage.setItem("opcionAlerta", "sin-informacion-descargada")
        const modal = await this.modalController.create({
          component: ModalAlertasCustomPage,
          cssClass: 'transparent-modal',
          componentProps: { mensaje: "Para poder consultar información es necesario descargar la edición o contar con acceso a internet." }
        })
        await modal.present();
      }
    }


  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  
  public async cambiosSelect(tipo: string) {
    // limpiar años y limpiar submarca
    console.log(this.form.controls)

    if (tipo == "marca") {
      this.form.controls['anio'].setValue(null);
      this.form.controls['submarca'].setValue(null);
      await this.obtenerAniosOffline(this.form.controls['marca'].value)

    }

    if (tipo == 'anio') {
      this.form.controls['submarca'].setValue(null);
      await this.obtenerSubmarcaOffline(this.form.controls['marca'].value, this.form.controls['anio'].value)
    }

  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  
  public async cambiosSelectOnline(tipo: string) {
    if (tipo == "marca") {
      this.form.controls['anio'].setValue(null);
      this.form.controls['submarca'].setValue(null);
      await this.obtenerAniosOnline(this.form.controls['marca'].value)
    }

    if (tipo == 'anio') {
      this.form.controls['submarca'].setValue(null);
      await this.obtenerSubMarcarOnline(this.form.controls['marca'].value)
    }
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async obtenerListadoMarcas() {
    this.obtenerTodasLineas = JSON.parse(localStorage.getItem('lineas')!);
    this.obtenerTodasMillas = JSON.parse(localStorage.getItem('millas')!);
    this.obtenerTodasImagenes = JSON.parse(localStorage.getItem('imagenes')!);

    for (let i = 0; i < this.obtenerTodasImagenes.length; i++) {
      this.obtenerTodasImagenes[i].start = Number(this.obtenerTodasImagenes[i].start)
      this.obtenerTodasImagenes[i].end = Number(this.obtenerTodasImagenes[i].end)
    }


  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async obtenerMarcasOffline() {
    if (this.obtenerTodasLineas.length == 0) return;
    this.marcasOffline = [];
    var array: any = this.obtenerTodasLineas;
    let hash: any = {};
    array = array.filter((o: { brand: string | number; }) => hash[o.brand] ? false : hash[o.brand] = true);
    for (let i = 0; i < array.length; i++) {
      this.marcasOffline.push(array[i].brand)
    }
    console.log(this.marcasOffline)
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async obtenerAniosOffline(marca: string) {
    this.aniosOffline = [];
    if (this.obtenerTodasLineas.length == 0) return;
    var array: any = this.obtenerTodasLineas;
    var arrayFiltrado = [];

    for (let i = 0; i < array.length; i++) {
      if (array[i].brand == marca) {
        arrayFiltrado.push(array[i])
      }
    }

    console.log(arrayFiltrado)

    let hash: any = {};
    arrayFiltrado = arrayFiltrado.filter((o: { year: any; }) =>
      hash[o.year] ? false : hash[o.year] = true);

    for (let i = 0; i < arrayFiltrado.length; i++) {
      this.aniosOffline.push(arrayFiltrado[i].year)
    }
    console.log(this.aniosOffline)
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async obtenerSubmarcaOffline(marca: string, anio: number) {
    console.log(marca, anio)
    this.subMarcasOffline = [];
    if (this.obtenerTodasLineas.length == 0) return;
    var array: any = this.obtenerTodasLineas;
    var arrayFiltrado = [];

    for (let i = 0; i < array.length; i++) {
      if (array[i].brand == marca && array[i].year == anio) {
        arrayFiltrado.push(array[i])
      }
    }

    console.log(arrayFiltrado)

    let hash: any = {};
    arrayFiltrado = arrayFiltrado.filter((o: { subbrand: string | number; }) =>
      hash[o.subbrand] ? false : hash[o.subbrand] = true);
    for (let i = 0; i < arrayFiltrado.length; i++) {
      this.subMarcasOffline.push(arrayFiltrado[i].subbrand)
    }
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async obtenerAniosOnline(marca: string) {
    let objeto: any = {
      month_period: 1,
      year_period: 2023,
      brand: marca
    }
    let respuesta = await this.webRestService.postAsync(API.endpoints.listaAnios, objeto)
    console.log("años online ", respuesta)
    if (respuesta.status == true) {
      if (respuesta.years.length > 0) {
        this.aniosOnline = respuesta.years;
      }
    }

  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async obtenerSubMarcarOnline(marca: string) {
    let objeto: any = {
      month_period: 1,
      year_period: 2023,
      brand: marca
    }
    let respuesta = await this.webRestService.postAsync(API.endpoints.listaSubmarcas, objeto)
    console.log("submarcas online", respuesta)
    if (respuesta.status == true) {
      if (respuesta.subbrands.length > 0) {
        this.subMarcasOnline = respuesta.subbrands;
      }
    }
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async obtenerMarcasOnline() {
    let objeto: any = {
      month_period: 1,
      year_period: 2023,
    }
    let respuesta = await this.webRestService.postAsync(API.endpoints.listaMarcas, objeto)
    console.log("marcas online", respuesta)
    if (respuesta.status == true) {
      if (respuesta.brands.length > 0) {
        this.marcasOnline = respuesta.brands;
      }
    }

  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async realizarConsultaOnline() {

    let anio: any = this.form.controls['anio'].value;
    let marca = this.form.controls['marca'].value.toLowerCase();
    let submarca = this.form.controls['submarca'].value.toLowerCase();
    let kilometraje = this.form.controls['kilometraje'].value;

    if (kilometraje == 0 || kilometraje == "" || !kilometraje) {
      localStorage.setItem("opcionAlerta", "kilometraje-vacio")
      const modal = await this.modalController.create({
        component: ModalAlertasCustomPage,
        cssClass: 'transparent-modal',
        componentProps: { mensaje: "Si no proporciona el kilometraje, se tomará en cuenta el kilometraje promedio para ese año." }
      })
      modal.onDidDismiss()
        .then(async (data) => {
          if (data.data) {
            let objeto = {
              client_id: this.usuario.id,
              month_period: 1,
              year_period: 2023,
              brand: marca,
              sub_brand: submarca,
              mileage: 0,
              year_car: anio,
              mobile_identifier: 'dnaibdayb82u31'
            }

            let respuesta = await this.webRestService.postAsync(API.endpoints.consultaAuto, objeto)
            console.log(respuesta)
            if (respuesta.status == true) {
              if (respuesta.cars.length > 0) {
                localStorage.setItem("resultadosConsulta", JSON.stringify(respuesta.cars))
                this.navCtrl.navigateRoot("resultados-consulta")
              }
            }
          } else {

          }
        });
      await modal.present();
    } else {
      let objeto = {
        client_id: this.usuario.id,
        month_period: 1,
        year_period: 2023,
        brand: marca,
        sub_brand: submarca,
        mileage: kilometraje,
        year_car: anio,
        mobile_identifier: 'dnaibdayb82u31'
      }

      let respuesta = await this.webRestService.postAsync(API.endpoints.consultaAuto, objeto)
      console.log(respuesta)
      if (respuesta.status == true) {
        if (respuesta.cars.length > 0) {
          localStorage.setItem("resultadosConsulta", JSON.stringify(respuesta.cars))
          this.navCtrl.navigateRoot("resultados-consulta")
        }
      }
    }
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async realizarConsulta() {

    if(!this.form.valid){
      await this.utilitiesService.validaCamposFormulario([this.form])
      localStorage.setItem("opcionAlerta", "campos-requeridos")
      const modal = await this.modalController.create({
        component: ModalAlertasCustomPage,
        cssClass: 'transparent-modal',
        componentProps: { mensaje: "Debe seleccionar un valor en los campos marcados con rojo." }
      })
      await modal.present();
      return;
    }
   
    let anio: any = this.form.controls['anio'].value;
    let marca = this.form.controls['marca'].value.toLowerCase();
    let submarca = this.form.controls['submarca'].value.toLowerCase();
    let kilometraje = this.form.controls['kilometraje'].value;
    let anioActual:any = new Date().getFullYear();


    if (kilometraje == 0 || kilometraje == "" || !kilometraje) {
      localStorage.setItem("opcionAlerta", "kilometraje-vacio")
      const modal = await this.modalController.create({
        component: ModalAlertasCustomPage,
        cssClass: 'transparent-modal',
        componentProps: { mensaje: "Si no proporciona el kilometraje, se tomará en cuenta el kilometraje promedio para ese año." }
      })
      modal.onDidDismiss()
        .then(async (data) => {
          if (data.data) {
            let valoresTotalesLinea = [];
            let valoresTotalesImagenes = [];
            let valoresTotalesMillas = [];

            for (let i = 0; i < this.obtenerTodasLineas.length; i++) {
              if (this.obtenerTodasLineas[i].year == anio &&
                this.obtenerTodasLineas[i].brand.toLowerCase() == marca &&
                this.obtenerTodasLineas[i].subbrand.toLowerCase() == submarca) {
                valoresTotalesLinea.push(this.obtenerTodasLineas[i])
              }
            }

            for (let j = 0; j < this.obtenerTodasImagenes.length; j++) {
              if (this.obtenerTodasImagenes[j].brand.toLowerCase() == marca && this.obtenerTodasImagenes[j].subbrand.toLowerCase() == submarca) {
                if (this.obtenerTodasImagenes[j].start <= anio && this.obtenerTodasImagenes[j].end >= anio) {
                  valoresTotalesImagenes.push(this.obtenerTodasImagenes[j])
                }
              }
            }

            let filtroKilometraje = [];

            if (valoresTotalesLinea.length > 0) {

              for (let i = 0; i < this.obtenerTodasMillas.length; i++) {
                for (let j = 0; j < valoresTotalesLinea.length; j++) {
                  if (valoresTotalesLinea[j].km_group == this.obtenerTodasMillas[i].grupo &&
                    valoresTotalesLinea[j].year == this.obtenerTodasMillas[i].year) {
                    filtroKilometraje.push(this.obtenerTodasMillas[i]);
                  }
                }
              }

              console.log(filtroKilometraje)
              
              for (let i = 0; i < filtroKilometraje.length; i++) {
                if (filtroKilometraje[i].inicial == 0 && filtroKilometraje[i].final == 0) {
                  valoresTotalesMillas.push(filtroKilometraje[i])
                }
              }

              if (valoresTotalesMillas.length > 0 && valoresTotalesLinea.length > 0 && valoresTotalesImagenes.length > 0) {
                for (let i = 0; i < valoresTotalesMillas.length; i++) {
                  for (let j = 0; j < valoresTotalesLinea.length; j++) {
                    if (i == j) {
                      const final = {
                        ...valoresTotalesMillas[i], ...valoresTotalesLinea[i]
                      }
                      final.imagen = valoresTotalesImagenes[0]
                      this.respuestaBusquedaOffline.push(final);
                    }
                  }
                }
              }

              if (this.respuestaBusquedaOffline.length > 0) {
                localStorage.setItem("resultadosConsulta", JSON.stringify(this.respuestaBusquedaOffline))
                this.navCtrl.navigateRoot("resultados-consulta")
              }
            }
          } else {

          }
        });
      await modal.present();
    } else {
      let valoresTotalesLinea = [];
      let valoresTotalesImagenes = [];
      let valoresTotalesMillas = [];

      for (let i = 0; i < this.obtenerTodasLineas.length; i++) {
        if (this.obtenerTodasLineas[i].year == anio &&
          this.obtenerTodasLineas[i].brand.toLowerCase() == marca &&
          this.obtenerTodasLineas[i].subbrand.toLowerCase() == submarca) {
          valoresTotalesLinea.push(this.obtenerTodasLineas[i])
        }
      }

      for (let j = 0; j < this.obtenerTodasImagenes.length; j++) {
        if (this.obtenerTodasImagenes[j].brand.toLowerCase() == marca && this.obtenerTodasImagenes[j].subbrand.toLowerCase() == submarca) {
          if (this.obtenerTodasImagenes[j].start <= anio && this.obtenerTodasImagenes[j].end >= anio) {
            valoresTotalesImagenes.push(this.obtenerTodasImagenes[j])
          }
        }
      }

      let filtroKilometraje = [];

      if (valoresTotalesLinea.length > 0) {

        for (let i = 0; i < this.obtenerTodasMillas.length; i++) {
          for (let j = 0; j < valoresTotalesLinea.length; j++) {
            if (valoresTotalesLinea[j].km_group == this.obtenerTodasMillas[i].grupo &&
              valoresTotalesLinea[j].year == this.obtenerTodasMillas[i].year) {
              filtroKilometraje.push(this.obtenerTodasMillas[i]);
            }
          }
        }


        for (let i = 0; i < filtroKilometraje.length; i++) {
          if (kilometraje >= filtroKilometraje[i].inicial && kilometraje <= filtroKilometraje[i].final) {
            valoresTotalesMillas.push(filtroKilometraje[i])
          }
        }


        if (valoresTotalesMillas.length > 0 && valoresTotalesLinea.length > 0 && valoresTotalesImagenes.length > 0) {


          for (let i = 0; i < valoresTotalesMillas.length; i++) {
            for (let j = 0; j < valoresTotalesLinea.length; j++) {
              if (i == j) {
                const final = {
                  ...valoresTotalesMillas[i], ...valoresTotalesLinea[i]
                }
                final.imagen = valoresTotalesImagenes[0]
                this.respuestaBusquedaOffline.push(final);
              }
            }
          }
        }

        console.log(valoresTotalesMillas)
        console.log(valoresTotalesLinea)
        console.log(valoresTotalesImagenes)

        console.log(this.respuestaBusquedaOffline)
        if (this.respuestaBusquedaOffline.length > 0) {
          localStorage.setItem("resultadosConsulta", JSON.stringify(this.respuestaBusquedaOffline))
          this.navCtrl.navigateRoot("resultados-consulta")
        }
      }
    }


  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -






}
