import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FileOpener } from "@ionic-native/file-opener"
import { DocumentViewer } from '@awesome-cordova-plugins/document-viewer/ngx';
import { DocumentViewerOptions } from '@awesome-cordova-plugins/document-viewer';
import { API } from 'src/app/endpoints';
import { WebRestService } from 'src/app/services/crud-rest.service';

@Component({
  selector: 'app-modal-terminos-condiciones',
  templateUrl: './modal-terminos-condiciones.page.html',
  styleUrls: ['./modal-terminos-condiciones.page.scss'],
})
export class ModalTerminosCondicionesPage implements OnInit {

  public esTerminos: any = localStorage.getItem('abrirTerminos');
  public stringPDFAvisoPrivacidad: string = '';
  public stringPDFTyC: string = '';
  stringPDFTerminos: any;
  stringPDFAviso: any;
  zoom: number = 1.0;

  constructor(public modalController: ModalController,
    private document: DocumentViewer,
    public webService: WebRestService) { }

  public async ngOnInit() {
    if(this.esTerminos == 1){
      await this.descargarArchivos(3)
    }else{
      await this.descargarArchivos(4)
    }
    
  }

  public dissmiss(acepto: boolean) {
    this.modalController.dismiss(acepto)
  }

  public async descargarArchivos(tipo: number){
    let objeto = {
      type: tipo
    }
    let respuesta = await this.webService.postAsync(API.endpoints.descargarPDF, objeto)
    if(respuesta.status == 200){
      let resp = respuesta.error?.text;
      if(tipo == 3){
        this.stringPDFTerminos = respuesta.error.text;
      }

      if(tipo == 4){
        this.stringPDFAviso = respuesta.error.text;
      }
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

}
