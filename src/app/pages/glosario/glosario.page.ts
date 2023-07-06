import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { API } from 'src/app/endpoints';
import { WebRestService } from 'src/app/services/crud-rest.service';

@Component({
  selector: 'app-glosario',
  templateUrl: './glosario.page.html',
  styleUrls: ['./glosario.page.scss'],
})
export class GlosarioPage implements OnInit {
 
  public valorSeleccionado: string = 'glosario';
  public stringPDFGlosario: string = '';
  public stringPDFKilometraje: string = '';
  public stringBitKilometraje: any;
  constructor(private menu: MenuController,
    public webService: WebRestService) { }

  public async ngOnInit() {
    this.menu.close();
    await this.descargarArchivos(1)
    await this.descargarArchivos(2)
    let respuesta = await this.webService.getAsync(API.endpoints.verPDFLinea)
    console.log(respuesta)
    if(respuesta.status == true){
      this.stringPDFGlosario = respuesta?.glosario;
      this.stringPDFKilometraje = respuesta?.kilometraje;
    }
  }

  segmentChanged(event: any){
    console.log(event.detail.value)
    this.valorSeleccionado = event.detail.value
  }

  public async descargarArchivos(tipo: number){
    let objeto = {
      type: tipo
    }
    let respuesta = await this.webService.postAsync(API.endpoints.descargarPDF, objeto)
    this.stringBitKilometraje = respuesta.error.text;
    console.log(respuesta.error.text)
  }

}
