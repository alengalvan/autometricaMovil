import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdministracionTarjetasPage } from './administracion-tarjetas.page';

const routes: Routes = [
  {
    path: '',
    component: AdministracionTarjetasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdministracionTarjetasPageRoutingModule {}
