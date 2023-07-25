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
  public stringPDFTyC: string = '';
  public stringPDFAP: string = '';
  zoom: number = 1.0;

  constructor(private menu: MenuController,
    public webService: WebRestService) { }

  public async ngOnInit() {
    this.menu.close();
    let objeto = {
      type: 4
    }
    let respuesta = await this.webService.postAsync(API.endpoints.descargarPDF, objeto)
    this.stringPDFAP = respuesta.error.text;
    console.log(respuesta.error.text)
  }

  public async segmentChanged(event: any) {
    console.log(event.detail.value)
    this.valorSeleccionado = event.detail.value;

    if (this.valorSeleccionado == 'avisoPrivacidad') {
      let objeto = {
        type: 4
      }
      let respuesta = await this.webService.postAsync(API.endpoints.descargarPDF, objeto)
      this.stringPDFAP = respuesta.error.text;
    }

    if (this.valorSeleccionado == 'terminosCondiciones') {
      let objeto = {
        type: 3
      }
      let respuesta = await this.webService.postAsync(API.endpoints.descargarPDF, objeto)
      this.stringPDFTyC = respuesta.error.text;
    }

  }



  closeFabIn(fab: any) {
    this.zoom = this.zoom + 0.25;
    fab.close();
  }

  closeFabOut(fab: any) {
    if (this.zoom > 1) {
      this.zoom = this.zoom - 0.25;
    }
    fab.close();
  }

  public async ngOnDestroy() {
    console.log("se destruye")
    let backDrop: any = document.querySelector('ion-backdrop');
    if (backDrop != null) {
      backDrop.click();
    }
  }
  
}
