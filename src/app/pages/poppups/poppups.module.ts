import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PoppupsPageRoutingModule } from './poppups-routing.module';

import { PoppupsPage } from './poppups.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PoppupsPageRoutingModule,
    ComponentsModule
  ],
  declarations: [PoppupsPage]
})
export class PoppupsPageModule {}
