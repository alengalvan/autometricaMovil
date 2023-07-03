import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-terminos-condiciones',
  templateUrl: './terminos-condiciones.page.html',
  styleUrls: ['./terminos-condiciones.page.scss'],
})
export class TerminosCondicionesPage implements OnInit {

  public valorSeleccionado: string = 'avisoPrivacidad'
  constructor(private menu: MenuController) { }

  public async ngOnInit() {
    this.menu.close();
  }

  segmentChanged(event: any){
    console.log(event.detail.value)
    this.valorSeleccionado = event.detail.value
  }

}
