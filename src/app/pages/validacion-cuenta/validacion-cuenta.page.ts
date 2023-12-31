import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-validacion-cuenta',
  templateUrl: './validacion-cuenta.page.html',
  styleUrls: ['./validacion-cuenta.page.scss'],
})
export class ValidacionCuentaPage implements OnInit {
  id: any = '';
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
  }
  
  public async ngOnDestroy() {
    console.log("se destruye")
    let backDrop: any = document.querySelector('ion-backdrop');
    if (backDrop != null) {
      backDrop.click();
    }
  }
}
