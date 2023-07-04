import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'recuperar-contrasenia',
    loadChildren: () => import('./pages/recuperar-contrasenia/recuperar-contrasenia.module').then( m => m.RecuperarContraseniaPageModule)
  },
  {
    path: 'restablecer-contrasenia',
    loadChildren: () => import('./pages/restablecer-contrasenia/restablecer-contrasenia.module').then( m => m.RestablecerContraseniaPageModule)
  },
  // prueba
  {
    path: 'restablecer-contrasenia/validar-cuenta/:id',
    loadChildren: () => import('./pages/restablecer-contrasenia/restablecer-contrasenia.module').then( m => m.RestablecerContraseniaPageModule)
  },
  {
    path: 'registro',
    loadChildren: () => import('./pages/registro/registro.module').then( m => m.RegistroPageModule)
  },
  {
    path: 'consulta-autometrica',
    loadChildren: () => import('./pages/consulta-autometrica/consulta-autometrica.module').then( m => m.ConsultaAutometricaPageModule)
  },
  {
    path: 'detalle-consulta-autometrica',
    loadChildren: () => import('./pages/detalle-consulta-autometrica/detalle-consulta-autometrica.module').then( m => m.DetalleConsultaAutometricaPageModule)
  },
  {
    path: 'mi-perfil',
    loadChildren: () => import('./pages/mi-perfil/mi-perfil.module').then( m => m.MiPerfilPageModule)
  },
  {
    path: 'datos-generales-edicion',
    loadChildren: () => import('./pages/datos-generales-edicion/datos-generales-edicion.module').then( m => m.DatosGeneralesEdicionPageModule)
  },
  {
    path: 'modal-terminos-condiciones',
    loadChildren: () => import('./pages/modal-terminos-condiciones/modal-terminos-condiciones.module').then( m => m.ModalTerminosCondicionesPageModule)
  },
  {
    path: 'pagos',
    loadChildren: () => import('./pages/pagos/pagos.module').then( m => m.PagosPageModule)
  },
  {
    path: 'terminos-condiciones',
    loadChildren: () => import('./pages/terminos-condiciones/terminos-condiciones.module').then( m => m.TerminosCondicionesPageModule)
  },
  {
    path: 'contactanos',
    loadChildren: () => import('./pages/contactanos/contactanos.module').then( m => m.ContactanosPageModule)
  },
  {
    path: 'validacion-cuenta/:id',
    loadChildren: () => import('./pages/validacion-cuenta/validacion-cuenta.module').then( m => m.ValidacionCuentaPageModule)
  },
  {
    path: 'modal-alertas-custom',
    loadChildren: () => import('./pages/modal-alertas-custom/modal-alertas-custom.module').then( m => m.ModalAlertasCustomPageModule)
  },
  {
    path: 'poppups',
    loadChildren: () => import('./pages/poppups/poppups.module').then( m => m.PoppupsPageModule)
  },
  {
    path: 'glosario',
    loadChildren: () => import('./pages/glosario/glosario.module').then( m => m.GlosarioPageModule)
  },
  {
    path: 'quienes-somos',
    loadChildren: () => import('./pages/quienes-somos/quienes-somos.module').then( m => m.QuienesSomosPageModule)
  },
  {
    path: 'metodos-pago',
    loadChildren: () => import('./pages/metodos-pago/metodos-pago.module').then( m => m.MetodosPagoPageModule)
  },
  {
    path: 'hacer-transaccion',
    loadChildren: () => import('./pages/hacer-transaccion/hacer-transaccion.module').then( m => m.HacerTransaccionPageModule)
  },
  {
    path: 'administracion-tarjetas',
    loadChildren: () => import('./pages/administracion-tarjetas/administracion-tarjetas.module').then( m => m.AdministracionTarjetasPageModule)
  },
  {
    path: 'alta-nueva-tarjeta',
    loadChildren: () => import('./pages/alta-nueva-tarjeta/alta-nueva-tarjeta.module').then( m => m.AltaNuevaTarjetaPageModule)
  },
  {
    path: 'alta-nueva-tarjeta/:id',
    loadChildren: () => import('./pages/alta-nueva-tarjeta/alta-nueva-tarjeta.module').then( m => m.AltaNuevaTarjetaPageModule)
  },
  {
    path: 'resumencompra-transferencia-prepago/:id',
    loadChildren: () => import('./pages/resumencompra-transferencia-prepago/resumencompra-transferencia-prepago.module').then( m => m.ResumencompraTransferenciaPrepagoPageModule)
  },
  {
    path: 'resultados-consulta',
    loadChildren: () => import('./pages/resultados-consulta/resultados-consulta.module').then( m => m.ResultadosConsultaPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
