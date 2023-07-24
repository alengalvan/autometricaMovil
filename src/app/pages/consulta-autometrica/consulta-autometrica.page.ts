import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, NavController } from '@ionic/angular';
import { API } from 'src/app/endpoints';
import { WebRestService } from 'src/app/services/crud-rest.service';
import { sqliteService } from 'src/app/services/sqlite.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { Network, ConnectionStatus } from '@capacitor/network'
import { ModalAlertasCustomPage } from '../modal-alertas-custom/modal-alertas-custom.page';
import { ActivatedRoute } from '@angular/router';
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
  public edicionDescargada = JSON.parse(localStorage.getItem('edicionDescargada')!);
  public form: FormGroup = this.formBuilder.group({
    marca: [null, [Validators.required]],
    submarca: [null, [Validators.required]],
    anio: [null, [Validators.required]],
    kilometraje: [null],
  });
  licenciaActual: any = [];
  public hayInternet = this.route.snapshot.paramMap.get('id');
  public LicenciasActivas: any = [];
  public dollarUSLocale = Intl.NumberFormat('en-US');

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
  public mensajeErrorKm = "";
  constructor(private formBuilder: FormBuilder,
    public utilitiesService: UtilitiesService,
    public sqliteService: sqliteService,
    public webRestService: WebRestService,
    public navCtrl: NavController,
    public modalController: ModalController,
    private route: ActivatedRoute) { }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  async ngOnInit() {
    if(!this.usuario){
      this.navCtrl.navigateRoot("login");
      return
    }
    
    let n: any = null
    localStorage.setItem("kilometraje", n)
    if (this.hayInternet) {
      await this.obtenerHistoricoLicencias()
    } else {
      // no ha descargado
      await this.obtenerInformacionOffline();
      await this.obtenerMarcasOffline()
    }


  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  
  public async obtenerHistoricoLicencias() {
    let respuestaServicio = await this.webRestService.getAsync(API.endpoints.verificarLicenciasActivas + this.usuario.id)
    console.log(respuestaServicio)
    let periodos: any = [];
    if (respuestaServicio.status == true) {
      // recorremos las licencias
      for (let i = 0; i < respuestaServicio?.data.length; i++) {
        for (let j = 0; j < respuestaServicio?.data[i].period.length; j++) {
          console.log(respuestaServicio?.data[i].period[j])
          let objeto = {
            mesNumero: Number(respuestaServicio?.data[i].period[j].month_period.split("-")[1]),
            anioNumero: Number(respuestaServicio?.data[i].period[j].month_period.split("-")[0]),
            mes: await this.utilitiesService.obtenerMesStringActual(Number(respuestaServicio?.data[i].period[j].month_period.split("-")[1])),
          }
          periodos.push(objeto)
        }
      }

      // una licencia
      if (periodos.length == 1) {
        this.licenciaActual = periodos
        await this.obtenerMarcasOnline();
      }

      // mas de una licencia, no puede haber 3
      if (periodos.length > 1) {

        //ordenamos por mes
        periodos = periodos.sort(((a: { mesNumero: number; }, b: { mesNumero: number; }) => a.mesNumero - b.mesNumero))
        localStorage.setItem("opcionAlerta", "selecciona-licencia")
        localStorage.setItem("primeraLicencia", JSON.stringify(periodos[0]))
        localStorage.setItem("segundaLicencia", JSON.stringify(periodos[1]))
        const modal = await this.modalController.create({
          component: ModalAlertasCustomPage,
          cssClass: 'transparent-modal',
          componentProps: { mensaje: "¿Qué edición desea consultar?" }
        })
        modal.onDidDismiss().then(async (data) => {
          if (data.data) {
            this.licenciaActual.push(periodos[1]);
          } else {
            this.licenciaActual.push(periodos[0]);
          }
          await this.obtenerMarcasOnline();
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
  public async obtenerInformacionOffline() {
    this.obtenerTodasLineas = JSON.parse(localStorage.getItem('lineas')!);
    this.obtenerTodasMillas = JSON.parse(localStorage.getItem('millas')!);
    this.obtenerTodasImagenes = JSON.parse(localStorage.getItem('imagenes')!);
    console.log(this.obtenerTodasLineas)
    console.log(this.obtenerTodasMillas)
    console.log(this.obtenerTodasImagenes)


    for (let i = 0; i < this.obtenerTodasImagenes.length; i++) {
      this.obtenerTodasImagenes[i].start = Number(this.obtenerTodasImagenes[i].start)
      this.obtenerTodasImagenes[i].end = Number(this.obtenerTodasImagenes[i].end)
    }
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async obtenerMarcasOffline() {
    if (this.obtenerTodasLineas.length == 0) return;
    this.marcasOffline = [];

    for (let i = 0; i < this.obtenerTodasLineas.length; i++) {
      if (this.obtenerTodasLineas[i].subbrand.includes('(') && this.obtenerTodasLineas[i].subbrand.includes(')')) {
        let comienza = this.obtenerTodasLineas[i].subbrand.indexOf("(")
        let final = this.obtenerTodasLineas[i].subbrand.indexOf(")")
        this.obtenerTodasLineas[i].subbrandSinLinea = this.obtenerTodasLineas[i].subbrand.slice(0, comienza).trim();
      } else {
        this.obtenerTodasLineas[i].subbrandSinLinea = this.obtenerTodasLineas[i].subbrand
      }

    }
    console.log(this.obtenerTodasLineas)

    var array: any = this.obtenerTodasLineas;
    let hash: any = {};
    array = array.filter((o: { brand: string | number; }) => hash[o.brand] ? false : hash[o.brand] = true);
    for (let i = 0; i < array.length; i++) {
      this.marcasOffline.push(array[i].brand)
    }
    this.marcasOffline = this.marcasOffline.sort();
    console.log(this.marcasOffline)
    console.log(this.obtenerTodasLineas)
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async obtenerAniosOffline(marca: string) {
    this.aniosOffline = [];
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
    this.aniosOffline.sort(function (a: number, b: number) { return b - a });
    console.log(this.aniosOffline)
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async obtenerSubmarcaOffline(marca: string, anio: number) {
    console.log(marca, anio)
    this.subMarcasOffline = [];
    var array: any = this.obtenerTodasLineas;
    var arrayFiltrado = [];

    for (let i = 0; i < array.length; i++) {
      if (array[i].brand == marca && array[i].year == anio) {
        arrayFiltrado.push(array[i])
      }
    }

    console.log(this.obtenerTodasLineas)

    let hash: any = {};
    arrayFiltrado = arrayFiltrado.filter((o: { subbrandSinLinea: string | number; }) =>
      hash[o.subbrandSinLinea] ? false : hash[o.subbrandSinLinea] = true);
    for (let i = 0; i < arrayFiltrado.length; i++) {
      this.subMarcasOffline.push(arrayFiltrado[i].subbrandSinLinea)
    }
    this.subMarcasOffline = this.subMarcasOffline.sort();
    console.log("resultado de submarca,", this.subMarcasOffline)
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async obtenerAniosOnline(marca: string) {
    this.aniosOnline = []
    let objetoPrincipal = this.licenciaActual[0];
    let objeto: any = {
      month_period: objetoPrincipal.mesNumero,
      year_period: objetoPrincipal.anioNumero,
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
    this.subMarcasOnline = []
    let objetoPrincipal = this.licenciaActual[0];
    let objeto: any = {
      month_period: objetoPrincipal.mesNumero,
      year_period: objetoPrincipal.anioNumero,
      brand: marca,
      year: this.form.controls['anio'].value
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
    let objetoPrincipal = this.licenciaActual[0];
    localStorage.setItem("licenciaConsultaOnline", JSON.stringify(objetoPrincipal))
    let objeto: any = {
      month_period: objetoPrincipal.mesNumero,
      year_period: objetoPrincipal.anioNumero,
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
    this.mensajeErrorKm = "";
    if (!this.form.valid) {
      this.utilitiesService.validaCamposFormulario([this.form]);
      localStorage.setItem("opcionAlerta", "campos-requeridos")
      const modal = await this.modalController.create({
        component: ModalAlertasCustomPage,
        cssClass: 'transparent-modal',
        componentProps: { mensaje: "Debe seleccionar un valor en los campos marcados con rojo." }
      })
      await modal.present();
      return;
    }


    let objetoPrincipal = this.licenciaActual[0];
    console.log(objetoPrincipal)

    var anio: any = this.form.controls['anio'].value;
    var marca = this.form.controls['marca'].value;
    var submarca = this.form.controls['submarca'].value;
    var kilometraje = this.form.controls['kilometraje'].value;
    var kil: any;
    if (kilometraje) {
      kil = kilometraje.includes(",") ? Number(kilometraje.replace(",", "")) : Number(kilometraje)
    } else {
      kil = 0;
    }

    if (kil == 0 || kil == "" || !kil) {
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
              month_period: objetoPrincipal.mesNumero,
              year_period: objetoPrincipal.anioNumero,
              brand: marca,
              sub_brand: submarca,
              mileage: kil == 0 || kil == "" || !kil ? 0 : kilometraje,
              year_car: anio,
              mobile_identifier: await this.utilitiesService.idTelefono()
            }

            let respuesta = await this.webRestService.postAsync(API.endpoints.consultaAuto, objeto)
            console.log(respuesta)

            if (respuesta.status == true) {
              if (respuesta.lineales.length > 0) {
                respuesta.lineales = await this.validarCampoPrecio(respuesta.lineales)
                localStorage.setItem("resultadosCars", JSON.stringify(respuesta.lineales))
                localStorage.setItem("resultadosAñadir", JSON.stringify(respuesta.añadir))
                localStorage.setItem("resultadosKilometraje", JSON.stringify(respuesta.kilometraje))
                let objetoBusqueda = {
                  anio: anio,
                  marca: marca,
                  submarca: submarca,
                  kilometraje: kil == 0 || kil == "" || !kil ? 0 : kil
                }
                localStorage.setItem("busquedaAutometrica", JSON.stringify(objetoBusqueda))
                this.navCtrl.navigateRoot("resultados-consulta/1")
              }
            }
          }
        });
      await modal.present();
    } else {

      let objeto = {
        client_id: this.usuario.id,
        month_period: objetoPrincipal.mesNumero,
        year_period: objetoPrincipal.anioNumero,
        brand: marca,
        sub_brand: submarca,
        mileage: kil == 0 || kil == "" || !kil ? 0 : kil,
        year_car: anio,
        mobile_identifier: await this.utilitiesService.idTelefono()
      }

      let respuesta = await this.webRestService.postAsync(API.endpoints.consultaAuto, objeto)
      console.log(respuesta)
      if (respuesta.status == true) {

        if (respuesta.kilometraje.length == 0) {
          localStorage.setItem("kilometraje", "1")
        } else {
          localStorage.setItem("kilometraje", "2")
        }
        if (respuesta.lineales.length > 0) {
          respuesta.lineales = await this.validarCampoPrecio(respuesta.lineales)
          localStorage.setItem("resultadosCars", JSON.stringify(respuesta.lineales))
          localStorage.setItem("resultadosAñadir", JSON.stringify(respuesta.añadir))
          localStorage.setItem("resultadosKilometraje", JSON.stringify(respuesta.kilometraje))
          let objetoBusqueda = {
            anio: anio,
            marca: marca,
            submarca: submarca,
            kilometraje: kilometraje == 0 || kilometraje == "" || !kilometraje ? 0 : kilometraje.includes(",") ? Number(kilometraje.replace(",", "")) : Number(kilometraje)
          }
          console.log(objetoBusqueda)
          localStorage.setItem("busquedaAutometrica", JSON.stringify(objetoBusqueda))
          this.navCtrl.navigateRoot("resultados-consulta/1")
        } else {
          this.mensajeErrorKm = "Kilometraje inválido."
        }
      }
    }
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async realizarConsulta() {
    if (!this.form.valid) {
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

    this.mensajeErrorKm = "";

    let anio: any = this.form.controls['anio'].value;
    let marcaSinAlterar = this.form.controls['marca'].value;
    let subMarcaSinAlterar = this.form.controls['submarca'].value;

    let marca = this.form.controls['marca'].value.toLowerCase();
    let submarca = this.form.controls['submarca'].value.toLowerCase();
    let kilometraje = this.form.controls['kilometraje'].value;

    let objetoBusqueda = {
      anio: anio,
      marca: marca,
      submarca: submarca,
      marcaSinAlterar: marcaSinAlterar,
      subMarcaSinAlterar: subMarcaSinAlterar,
      kilometraje: kilometraje == 0 || kilometraje == "" || !kilometraje ? 0 : kilometraje.includes(",") ?
        Number(kilometraje.replace(",", "")) : Number(kilometraje)
    }


    localStorage.setItem("busquedaAutometrica", JSON.stringify(objetoBusqueda))

    if (objetoBusqueda.kilometraje == 0) {
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

            console.log(this.obtenerTodasLineas)

            for (let i = 0; i < this.obtenerTodasLineas.length; i++) {
              if (this.obtenerTodasLineas[i].year == anio &&
                this.obtenerTodasLineas[i].brand.toLowerCase() == marca &&
                this.obtenerTodasLineas[i].subbrandSinLinea.toLowerCase() == submarca) {
                console.log()
                valoresTotalesLinea.push(this.obtenerTodasLineas[i])
              }
            }


            valoresTotalesLinea = await this.validarCampoPrecioOffline(valoresTotalesLinea)
            console.log("despues de colocarles los valores ", valoresTotalesLinea)
            // separar por linea
            let lineasNuevas = [];
            let cambioLinea = [];
            let lineaAnterior = [];
            let sinInformacion = [];

            for (let i = 0; i < valoresTotalesLinea.length; i++) {
              if (valoresTotalesLinea[i].subbrand.toLowerCase().includes('(línea nueva)')) {
                lineasNuevas.push(valoresTotalesLinea[i])
              }

              if (valoresTotalesLinea[i].subbrand.toLowerCase().includes('(cambio de línea)')) {
                cambioLinea.push(valoresTotalesLinea[i])
              }

              if (valoresTotalesLinea[i].subbrand.toLowerCase().includes('(línea anterior)')) {
                lineaAnterior.push(valoresTotalesLinea[i])
              }

              if (valoresTotalesLinea[i].subbrand == valoresTotalesLinea[i].subbrandSinLinea) {
                sinInformacion.push(valoresTotalesLinea[i])
              }

            }


            let respuesta = [];

            respuesta.push(await this.ordenarRespuesta(sinInformacion))
            respuesta.push(await this.ordenarRespuesta(lineasNuevas))
            respuesta.push(await this.ordenarRespuesta(lineaAnterior))
            respuesta.push(await this.ordenarRespuesta(cambioLinea))

            console.log(respuesta);
            let respuestaFiltrada = [];
            for (let i = 0; i < respuesta.length; i++) {
              if (respuesta[i] != null) {
                respuestaFiltrada.push(respuesta[i])
              }
            }

            if (respuestaFiltrada.length > 0) {
              localStorage.setItem("resultadosConsulta", JSON.stringify(respuestaFiltrada))
              this.navCtrl.navigateRoot("resultados-consulta")
            } else {
              console.log("no existen registros")
            }
            console.log(respuestaFiltrada);
          }
        });
      await modal.present();
    } else {
      let valoresTotalesLinea = [];

      console.log(this.obtenerTodasLineas)

      for (let i = 0; i < this.obtenerTodasLineas.length; i++) {
        if (this.obtenerTodasLineas[i].year == anio &&
          this.obtenerTodasLineas[i].brand.toLowerCase() == marca &&
          this.obtenerTodasLineas[i].subbrandSinLinea.toLowerCase() == submarca) {
          console.log()
          valoresTotalesLinea.push(this.obtenerTodasLineas[i])
        }
      }

      console.log(valoresTotalesLinea)
      valoresTotalesLinea = await this.validarCampoPrecioOffline(valoresTotalesLinea)
      // separar por linea
      let lineasNuevas = [];
      let cambioLinea = [];
      let lineaAnterior = [];
      let sinInformacion = [];

      // iteracion para que se generen los grupos
      for (let i = 0; i < valoresTotalesLinea.length; i++) {
        if (valoresTotalesLinea[i].subbrand.toLowerCase().includes('(línea nueva)')) {
          lineasNuevas.push(valoresTotalesLinea[i])
        }

        if (valoresTotalesLinea[i].subbrand.toLowerCase().includes('(cambio de línea)')) {
          cambioLinea.push(valoresTotalesLinea[i])
        }

        if (valoresTotalesLinea[i].subbrand.toLowerCase().includes('(línea anterior)')) {
          lineaAnterior.push(valoresTotalesLinea[i])
        }

        if (valoresTotalesLinea[i].subbrand == valoresTotalesLinea[i].subbrandSinLinea) {
          sinInformacion.push(valoresTotalesLinea[i])
        }

      }

      let respuesta = [];

      respuesta.push(await this.ordenarRespuesta(sinInformacion))
      respuesta.push(await this.ordenarRespuesta(lineasNuevas))
      respuesta.push(await this.ordenarRespuesta(lineaAnterior))
      respuesta.push(await this.ordenarRespuesta(cambioLinea))

      console.log(respuesta);
      let respuestaFiltrada = [];
      for (let i = 0; i < respuesta.length; i++) {
        if (respuesta[i] != null) {
          respuestaFiltrada.push(respuesta[i])
        }
      }

      // filtro para encontra y agregar los kilometrajes
      for (let i = 0; i < respuestaFiltrada.length; i++) {
        let kilometraje: any = [];
        for (let j = 0; j < respuestaFiltrada[i]!.list!.length; j++) {
          for (let k = 0; k < this.obtenerTodasMillas.length; k++) {
            if (this.obtenerTodasMillas[k].grupo == respuestaFiltrada[i]!.list![j].km_group
              && this.obtenerTodasMillas[k].year == respuestaFiltrada[i]!.list![j].year) {
              if (objetoBusqueda.kilometraje >= this.obtenerTodasMillas[k].inicial
                && objetoBusqueda.kilometraje <= this.obtenerTodasMillas[k].final) {
                kilometraje.push(this.obtenerTodasMillas[k])
              }
            }
          }
          respuestaFiltrada[i]!.kilometraje = kilometraje
        }
      }

      console.log(respuestaFiltrada);

      // vamos a depurar los repetidos
      for (let i = 0; i < respuestaFiltrada.length; i++) {
        let hash: any = {};
        respuestaFiltrada[i]!.kilometraje = respuestaFiltrada[i]!.kilometraje.filter((o: { subbrandSinLinea: string | number; }) =>
          hash[o.subbrandSinLinea] ? false : hash[o.subbrandSinLinea] = true);
      }


      let noExistenKilometros = 0;
      for (let i = 0; i < respuestaFiltrada.length; i++) {
        for (let j = 0; j < respuestaFiltrada[i]!.list!.length; j++) {
          console.log(respuestaFiltrada[i]!.kilometraje.length == 0)
          if (respuestaFiltrada[i]!.kilometraje.length == 0) {
            noExistenKilometros++;
          }
        }
      }


      if (noExistenKilometros == 0) {
        localStorage.setItem("kilometraje", "1")
      } else {
        localStorage.setItem("kilometraje", "2")
      }

      console.log(respuestaFiltrada);
      localStorage.setItem("resultadosConsulta", JSON.stringify(respuestaFiltrada))
      this.navCtrl.navigateRoot("resultados-consulta")
    }

  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async ordenarRespuesta(arrayLinea: any) {
    console.log(arrayLinea)
    if (arrayLinea.length == 0) return null;

    let lineas = [];
    let anadires = [];

    for (let i = 0; i < arrayLinea.length; i++) {
      // debugger
      if (arrayLinea[i].add_version != "5") {
        lineas.push(arrayLinea[i])
      } else {
        anadires.push(arrayLinea[i])
      }
    }

    let arregloComodin: any = [];
    let objetoReturn = {
      anadires: anadires,
      kilometraje: arregloComodin,
      list: lineas,
      name: arrayLinea[0].subbrand
    }

    console.log(objetoReturn)
    console.log(lineas)
    console.log(anadires)

    return objetoReturn;
  }


  public async validarCampoPrecio(array: any) {
    console.log(array)
    for (let i = 0; i < array.length; i++) {
      for (let j = 0; j < array[i].list.length; j++) {
        console.log(array[i].list[j].sale)
        console.log(array[i].list[j].sale.search("[a-zA-Z ]"))
        if (array[i].list[j].sale.search("[a-zA-Z ]") == -1 && array[i].list[j].sale != "" && !array[i].list[j].sale.includes("$")) {
          array[i].list[j].sale = "$" + this.dollarUSLocale.format(array[i].list[j].sale)
          console.log(array[i].list[j].sale)
        }
        console.log(array[i].list[j].purchase)
        console.log(array[i].list[j].purchase.search("[a-zA-Z ]"))
        // debugger
        if (array[i].list[j].purchase.search("[a-zA-Z ]") == -1 && array[i].list[j].purchase != "" && !array[i].list[j].purchase.includes("$")) {
          array[i].list[j].purchase = "$" + this.dollarUSLocale.format(array[i].list[j].purchase)
          console.log(array[i].list[j].purchase)
        }
      }
    }
    console.log(array)
    return array

  }


  public async validarCampoPrecioOffline(array: any) {
    console.log(array)
    for (let i = 0; i < array.length; i++) {

      if (array[i].sale.search("[a-zA-Z ]") == -1 && array[i].sale != "" && !array[i].sale.includes("$")) {
        console.log(array[i].sale)
        array[i].sale = "$" + this.dollarUSLocale.format(array[i].sale)
        console.log(array[i].sale)
      }
      if (array[i].purchase.search("[a-zA-Z ]") == -1 && array[i].purchase != "" && !array[i].purchase.includes("$")) {
        array[i].purchase = "$" + this.dollarUSLocale.format(array[i].purchase)
        console.log(array[i].purchase)
      }

    }
    console.log(array)
    return array

  }

  public async ngOnDestroy() {
    console.log("se destruye")
    let backDrop: any = document.querySelector('ion-backdrop');
    if (backDrop != null) {
      backDrop.click();
    }
  }

}
