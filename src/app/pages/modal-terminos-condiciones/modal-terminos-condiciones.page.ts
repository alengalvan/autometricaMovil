import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FileOpener } from "@ionic-native/file-opener"
import { DocumentViewer } from '@awesome-cordova-plugins/document-viewer/ngx';
import { DocumentViewerOptions } from '@awesome-cordova-plugins/document-viewer';

@Component({
  selector: 'app-modal-terminos-condiciones',
  templateUrl: './modal-terminos-condiciones.page.html',
  styleUrls: ['./modal-terminos-condiciones.page.scss'],
})
export class ModalTerminosCondicionesPage implements OnInit {

  public esTerminos: any = localStorage.getItem('abrirTerminos');
  public filePath: any = this.esTerminos == 1 ? localStorage.getItem("pathTycFile") : localStorage.getItem("pathApFile")


  constructor(public modalController: ModalController,
    private document: DocumentViewer) { }

  public async ngOnInit() {
    const options: DocumentViewerOptions = {
      title: 'My PDF'
    }
    // this.document.viewDocument(this.filePath, 'application/pdf', options)
    const mimeType = "application/pdf"
    await FileOpener.open(this.filePath, mimeType)
  }

  public dissmiss(acepto: boolean) {
    this.modalController.dismiss(acepto)
  }

}
