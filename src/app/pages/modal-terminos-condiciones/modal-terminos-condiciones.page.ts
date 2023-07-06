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

  constructor(public modalController: ModalController,
    private document: DocumentViewer,
    public webService: WebRestService) { }

  public async ngOnInit() {
    let respuesta = await this.webService.getAsync(API.endpoints.verPDFLinea)
    console.log(respuesta)
    if(respuesta.status == true){
      this.stringPDFAvisoPrivacidad = respuesta?.ap;
      this.stringPDFTyC = respuesta?.tyc;
    }
  }

  public dissmiss(acepto: boolean) {
    this.modalController.dismiss(acepto)
  }

}
