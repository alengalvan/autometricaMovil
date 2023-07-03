import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent  implements OnInit {

  @Input() textoBoton: string | undefined;
  @Input() opcion!: number;
  @Input() verMenu!: boolean;
  @Input() tipoCabecera!: number;
  public currentColor = '#1F1F1F';
  
  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  constructor(private navCtrl: NavController) { }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  ngOnInit() {}

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async goTo(opcion: number){
    if(opcion == 1){
      this.navCtrl.navigateRoot("registro");
    }else if(opcion == 2 || opcion == 3){
      this.navCtrl.navigateRoot("login");
    }
  }

}
