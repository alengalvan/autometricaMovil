import { Injectable } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { AlertController, LoadingController, ModalController, NavController, ToastController } from '@ionic/angular';
import { SQLiteConnection, CapacitorSQLite, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { WebRestService } from './crud-rest.service';
import { API } from '../endpoints';
import { BehaviorSubject } from 'rxjs';
import { Network, ConnectionStatus } from '@capacitor/network'
import { ModalAlertasCustomPage } from '../pages/modal-alertas-custom/modal-alertas-custom.page';
import { Capacitor } from '@capacitor/core';
import { UtilitiesService } from './utilities.service';


@Injectable({
  providedIn: 'root'
})
export class sqliteService {

  public totalDescarga$ = new BehaviorSubject<number>(0);
  public totalCargados$ = new BehaviorSubject<number>(0);
  totalDescargaObs$ = this.totalDescarga$.asObservable();
  totalCargadosObs$ = this.totalCargados$.asObservable();
  public networkStatus: ConnectionStatus | undefined;
  public estaGenerandoBase$ = new BehaviorSubject<boolean>(false);
  estaDescargandoObs$ = this.estaGenerandoBase$.asObservable();
  public isWeb: boolean = false;
  public contador: number = 0;

  // menu
  public listaModulos$ = new BehaviorSubject<any>(false);
  listaModulosObs$ = this.listaModulos$.asObservable();

  public schemaLineals: any = `CREATE TABLE IF NOT EXISTS lineals (
    id INTEGER PRIMARY KEY,
    year INTEGER,
    brand TEXT,
    subbrand TEXT,
    version TEXT,
    km_group TEXT,
    add_version TEXT,
    sale TEXT,
    purchase TEXT,
    s_reporte INTEGER,
    month_edition INTEGER,
    year_edition INTEGER
  )`;

  public schemaMileages: any = `CREATE TABLE IF NOT EXISTS mileages (
    id INTEGER PRIMARY KEY,
    inicial INTEGER,
    final INTEGER,
    grupo TEXT,
    year INTEGER,
    valor TEXT,
    month_edition INTEGER,
    year_edition INTEGER
  )`;

  public schemaImages: any = `CREATE TABLE IF NOT EXISTS images (
    id INTEGER PRIMARY KEY,
    brand TEXT,
    subbrand TEXT,
    version TEXT,
    start TEXT,
    end TEXT,
    filename INTEGER
  )`;

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  constructor(private navCtrl: NavController,
    private alertCtrl: AlertController,
    private toastController: ToastController,
    private loadingController: LoadingController,
    public alertController: AlertController,
    public modalController: ModalController,
    public webRestService: WebRestService,
    public utilitiesService: UtilitiesService
  ) { }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async ngOnInit() { }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async verificacionConexion(mes: number, anio: number, vienePerfil?: boolean) {
    if (Network) {
      Network.getStatus().then(async (status) => {
        console.log(status)

        if (status?.connected) {
          if (status.connectionType == "cellular") {
            console.log("entramos por cellular")
            localStorage.setItem("opcionAlerta", "descarga-datos")
            const modal = await this.modalController.create({
              component: ModalAlertasCustomPage,
              cssClass: 'transparent-modal',
              componentProps: {
                mensaje: ""
              }
            })

            modal.onDidDismiss().then(async (data) => {
              if (data.data) {
                await this.procesoDescarga(mes, anio);
              } else {
                this.modalController.dismiss();
                localStorage.setItem("opcionAlerta", "descarga-pendiente")
                const modal = await this.modalController.create({
                  component: ModalAlertasCustomPage,
                  cssClass: 'transparent-modal',
                  componentProps: {
                    mensaje: ""
                  }
                })
                await modal.present();
                this.navCtrl.navigateRoot("mi-perfil")
              }
            });
            await modal.present();
          }

          if (status.connectionType == "wifi") {
            console.log("entramos por wifi")
            await this.procesoDescarga(mes, anio);
          }

        }

      })
    }
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async procesoDescarga(mes: number, anio: number, diferentePerfil?: boolean) {

    // actulizamos descarga
   await  this.descargarArchivos(1)
    await this.descargarArchivos(2)
    
    
    let objeto = {
      month: mes,
      year: anio,
      client_id: JSON.parse(localStorage.getItem('usuario')!).id
    }

    console.log(objeto, " se descargo")
    let respuesta = await this.webRestService.postAsync(API.endpoints.traerBD, objeto);
    console.log(respuesta)
    if (respuesta.status == true) {
      let objetoGuardar = {
        month: mes,
        year: anio,
        client_id: JSON.parse(localStorage.getItem('usuario')!).id,
        mes:  this.utilitiesService.obtenerMesStringActual(mes),
        year_hire: anio
      }

      localStorage.setItem("edicionDescargada", JSON.stringify(objetoGuardar))
      console.log("se descargo esta wea")
      if (diferentePerfil) {
        this.navCtrl.navigateRoot("mi-perfil")
      }

      localStorage.setItem("lineas", JSON.stringify(respuesta.lineals))
      localStorage.setItem("millas", JSON.stringify(respuesta.mileages))
      localStorage.setItem("imagenes", JSON.stringify(respuesta.images))
      localStorage.setItem("opcionAlerta", "descarga-exitosa")
      
      const modal = await this.modalController.create({
        component: ModalAlertasCustomPage,
        cssClass: 'transparent-modal',
        componentProps: {
          mensaje: ""
        }
      })
      await modal.present();
      this.navCtrl.navigateRoot("mi-perfil")
    } else {

    }
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async crearLineas(listaLineas: any = []) {
    const sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
    let db: SQLiteDBConnection = await sqlite.createConnection('autometrica', false, 'no-encryption', 1, false);

    try {
      await db.open();
      // creamos en caso de que no este
      let result = await db.execute(this.schemaLineals)
      // si ya existe vamos a vaciarla
      const deleteTable = `DELETE FROM lineals;`
      await db.execute(deleteTable)
      for (let i = 0; i < listaLineas.length; i++) {
        const instruccion = `
          INSERT INTO lineals(id,year,brand,subbrand,version,km_group,add_version,sale,purchase,s_reporte,month_edition,year_edition ) VALUES 
          (${listaLineas[i].id},${listaLineas[i].year},"${listaLineas[i].brand}","${listaLineas[i].subbrand}","${listaLineas[i].version}","${listaLineas[i].km_group}","${listaLineas[i].add_version}","${listaLineas[i].sale}","${listaLineas[i].purchase}",${listaLineas[i].s_reporte},${listaLineas[i].month_edition},${listaLineas[i].year_edition})
        `;
        result = await db.execute(instruccion);
        this.contador++;
        this.totalCargados$.next(this.contador);
      }

      const res = await db.query('SELECT * FROM lineals');
      console.log(res);

      await sqlite.closeAllConnections();

    } catch (e) {
      this.estaGenerandoBase$.next(false);
      console.log('ERROR ', e)
    }

  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async crearMileages(listaMileages: any = []) {
    const sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
    let db: SQLiteDBConnection = await sqlite.createConnection('autometrica', false, 'no-encryption', 1, false);

    try {
      await db.open();
      // creamos en caso de que no este
      let result = await db.execute(this.schemaMileages)
      // si ya existe vamos a vaciarla
      const deleteTable = `DELETE FROM mileages;`
      await db.execute(deleteTable)
      for (let i = 0; i < listaMileages.length; i++) {
        const instruccion = `
          INSERT INTO mileages(id,inicial,final,grupo,year,valor,month_edition,year_edition) VALUES 
          (${listaMileages[i].id},${listaMileages[i].inicial},${listaMileages[i].final},"${listaMileages[i].grupo}",${listaMileages[i].year},"${listaMileages[i].valor}",${listaMileages[i].month_edition},${listaMileages[i].year_edition})
        `;
        result = await db.execute(instruccion);
        this.contador++;
        this.totalCargados$.next(this.contador);
      }

      const res = await db.query('SELECT * FROM mileages');
      console.log(res);

      await sqlite.closeAllConnections();

    } catch (e) {
      console.log('ERROR ', e)
      this.estaGenerandoBase$.next(false);
    }

  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async crearImages(listaImages: any = []) {
    const sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
    let db: SQLiteDBConnection = await sqlite.createConnection('autometrica', false, 'no-encryption', 1, false);

    try {
      await db.open();
      // creamos en caso de que no este
      let result = await db.execute(this.schemaImages)
      // si ya existe vamos a vaciarla
      const deleteTable = `DELETE FROM images;`
      await db.execute(deleteTable)



      for (let i = 0; i < listaImages.length; i++) {
        const instruccion = `
          INSERT INTO images(id,brand,subbrand,version,start,end,filename) VALUES 
          (${listaImages[i].id},"${listaImages[i].brand}","${listaImages[i].subbrand}","${listaImages[i].version}","${listaImages[i].start}","${listaImages[i].end}","${listaImages[i].filename}")
        `;
        result = await db.execute(instruccion);
        this.contador++;
        this.totalCargados$.next(this.contador);
      }

      const res = await db.query('SELECT * FROM images');
      console.log(res);

      await sqlite.closeAllConnections();

    } catch (e) {
      this.estaGenerandoBase$.next(false);
      console.log('ERROR ', e)
    }

  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async cancelarDescarga() {
    let sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
    await sqlite.closeAllConnections();

    let db: SQLiteDBConnection = await sqlite.createConnection('autometrica', false, 'no-encryption', 1, false);
    this.estaGenerandoBase$.next(false);

    try {
      await db.open();
      let deleteTable = `DELETE FROM lineals;`
      await db.execute(deleteTable)

      deleteTable = `DELETE FROM mileages;`
      await db.execute(deleteTable)

      deleteTable = `DELETE FROM images;`
      await db.execute(deleteTable)
      await sqlite.closeAllConnections();

    } catch (e) {
      console.log('ERROR ', e)
    }
  }


  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async obtenerMarcas() {
    const sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
    let db: SQLiteDBConnection = await sqlite.createConnection('autometrica', false, 'no-encryption', 1, false);
    const query = `SELECT * FROM lineals`;
    const result = await db.query(query);
    await sqlite.closeAllConnections();
    return result.values?.[0] || null;
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async obtenerAnios(marca: string) {

  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async obtenerSubmarca(marca: string) {

  }

  public async descargarArchivos(tipo: number){
    let objeto = {
      type: tipo
    }
    let respuesta = await this.webRestService.postAsync(API.endpoints.descargarPDF, objeto)
    if(respuesta.status == 200){
      let resp = respuesta.error?.text;
      if(tipo == 1){
        localStorage.setItem("glosario", resp);
      }

      if(tipo == 2){
        localStorage.setItem("kilometraje", resp)
      }
    }
  }

  









}
