import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { API } from 'src/app/endpoints';
import { WebRestService } from 'src/app/services/crud-rest.service';

@Component({
  selector: 'app-terminos-condiciones',
  templateUrl: './terminos-condiciones.page.html',
  styleUrls: ['./terminos-condiciones.page.scss'],
})
export class TerminosCondicionesPage implements OnInit {

  public valorSeleccionado: string = 'avisoPrivacidad';
  public stringPDFAvisoPrivacidad: string = '';
  public stringPDFTyC: string = '';
  constructor(private menu: MenuController,
    public webService: WebRestService) { }

  public async ngOnInit() {
    this.menu.close();
    let respuesta = await this.webService.getAsync(API.endpoints.verPDFLinea)
    console.log(respuesta)
    if(respuesta.status == true){
      this.stringPDFAvisoPrivacidad = respuesta?.ap;
      this.stringPDFTyC = respuesta?.tyc;
    }
  }

  segmentChanged(event: any) {
    console.log(event.detail.value)
    this.valorSeleccionado = event.detail.value
  }

}
