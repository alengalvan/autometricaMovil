import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './footer/footer.component';
import { HeaderTitleComponent } from './header-title/header-title.component';
import { HeaderSinOpcionesComponent } from './header-sin-opciones/header-sin-opciones.component';



@NgModule({
    declarations: [
        HeaderComponent,
        FooterComponent,
        HeaderTitleComponent,
        HeaderSinOpcionesComponent
    ],
    exports: [
        HeaderComponent,
        FooterComponent,
        HeaderTitleComponent,
        HeaderSinOpcionesComponent
    ],
    imports: [
        CommonModule,
        IonicModule,
        RouterModule
    ]
})
export class ComponentsModule { }
