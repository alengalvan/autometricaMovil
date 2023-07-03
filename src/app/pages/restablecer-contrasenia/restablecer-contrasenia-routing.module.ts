import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RestablecerContraseniaPage } from './restablecer-contrasenia.page';

const routes: Routes = [
  {
    path: '',
    component: RestablecerContraseniaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RestablecerContraseniaPageRoutingModule {}
