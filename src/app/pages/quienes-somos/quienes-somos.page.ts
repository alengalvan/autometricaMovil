import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
  selector: 'app-quienes-somos',
  templateUrl: './quienes-somos.page.html',
  styleUrls: ['./quienes-somos.page.scss'],
})
export class QuienesSomosPage implements OnInit {

  constructor(public utilitiesServices: UtilitiesService,
    public modalController: ModalController) { }

  async ngOnInit() {
    const modal = await this.modalController.getTop();
    if(modal){
      await this.utilitiesServices.cerrarModal();
    }
  }

  public async ngOnDestroy() {
    console.log("se destruye")
    let backDrop: any = document.querySelector('ion-backdrop');
    if (backDrop != null) {
      backDrop.click();
    }
  }

}
