import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalAlertasCustomPage } from './modal-alertas-custom.page';

const routes: Routes = [
  {
    path: '',
    component: ModalAlertasCustomPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalAlertasCustomPageRoutingModule {}
