import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AltaNuevaTarjetaPage } from './alta-nueva-tarjeta.page';

const routes: Routes = [
  {
    path: '',
    component: AltaNuevaTarjetaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AltaNuevaTarjetaPageRoutingModule {}
