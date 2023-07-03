import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResumencompraTransferenciaPrepagoPage } from './resumencompra-transferencia-prepago.page';

const routes: Routes = [
  {
    path: '',
    component: ResumencompraTransferenciaPrepagoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResumencompraTransferenciaPrepagoPageRoutingModule {}
