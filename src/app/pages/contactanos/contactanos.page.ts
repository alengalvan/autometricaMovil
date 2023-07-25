import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
  selector: 'app-contactanos',
  templateUrl: './contactanos.page.html',
  styleUrls: ['./contactanos.page.scss'],
})
export class ContactanosPage implements OnInit {

  constructor(public modalController: ModalController,
    public utilitiesService: UtilitiesService) { }

  async ngOnInit() {
    const modal = await this.modalController.getTop();
    if(modal){
      await this.utilitiesService.cerrarModal();
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
