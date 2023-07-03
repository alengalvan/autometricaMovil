import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ValidacionCuentaPage } from './validacion-cuenta.page';

const routes: Routes = [
  {
    path: '',
    component: ValidacionCuentaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ValidacionCuentaPageRoutingModule {}
