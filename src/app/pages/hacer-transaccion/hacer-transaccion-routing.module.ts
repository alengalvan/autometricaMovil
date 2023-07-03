import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HacerTransaccionPage } from './hacer-transaccion.page';

const routes: Routes = [
  {
    path: '',
    component: HacerTransaccionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HacerTransaccionPageRoutingModule {}
