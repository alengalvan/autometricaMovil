import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalTerminosCondicionesPage } from './modal-terminos-condiciones.page';

const routes: Routes = [
  {
    path: '',
    component: ModalTerminosCondicionesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalTerminosCondicionesPageRoutingModule {}
