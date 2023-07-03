import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HacerTransaccionPageRoutingModule } from './hacer-transaccion-routing.module';
import { HacerTransaccionPage } from './hacer-transaccion.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HacerTransaccionPageRoutingModule,
    ComponentsModule,
    ReactiveFormsModule
  ],
  declarations: [HacerTransaccionPage]
})
export class HacerTransaccionPageModule {}
