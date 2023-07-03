import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-poppups',
  templateUrl: './poppups.page.html',
  styleUrls: ['./poppups.page.scss'],
})
export class PoppupsPage implements OnInit {

  public opcionPopup = localStorage.getItem('opcionPopup')
  public mensajePopup = localStorage.getItem('mensajePopup')

  constructor(private navCtrl: NavController) { }

  ngOnInit() { }

  public irLogin() {
    this.navCtrl.navigateRoot("login");
  }

}
