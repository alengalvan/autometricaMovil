import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-glosario',
  templateUrl: './glosario.page.html',
  styleUrls: ['./glosario.page.scss'],
})
export class GlosarioPage implements OnInit {
 
  public valorSeleccionado: string = 'glosario'
  constructor(private menu: MenuController) { }

  public async ngOnInit() {
    this.menu.close();
  }

  segmentChanged(event: any){
    console.log(event.detail.value)
    this.valorSeleccionado = event.detail.value
  }


}
