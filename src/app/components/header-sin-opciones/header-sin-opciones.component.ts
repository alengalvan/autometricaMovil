import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-header-sin-opciones',
  templateUrl: './header-sin-opciones.component.html',
  styleUrls: ['./header-sin-opciones.component.scss'],
})
export class HeaderSinOpcionesComponent  implements OnInit {

  @Input() textoBoton: string | undefined;
  @Input() opcion!: number;
  public currentColor = '#1F1F1F';

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  constructor(private navCtrl: NavController) { }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  ngOnInit() {}

}
