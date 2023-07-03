import { environment } from "./enviroments";

export const API = {
    endpoints: {
      login: environment.proyectoBase + '/api/user/login',
      registro: environment.proyectoBase + '/api/user/register',
      verificarCuenta: environment.proyectoBase +'/api/user/verify-account',
      actualizarUsuario:  environment.proyectoBase +'/api/user/update',
      cambiarContrasenia: environment.proyectoBase + '/api/user/forget-password',
      setearContrasenia: environment.proyectoBase + '/api/user/reset-password',
      getListado: environment.proyectoBase + '/api/license/list?client_id=',
      contratarLicenciaTarjeta: environment.proyectoBase + '/api/license/hire-license',
      contratarLicenciaPorPago: environment.proyectoBase + '/api/license/hire-card-license',
      historialLicencias: environment.proyectoBase + '/api/license/history-hire-license',
      descargarPDF: environment.proyectoBase + '/api/pdf/dowloand',
      verPDFLinea: environment.proyectoBase + '/api/pdf/url',
      reenviarCorreo: environment.proyectoBase + '/api/user/resend-verify-email',
      validarLicencia: environment.proyectoBase + '/api/license/valid-license-hire',
      traerBD: environment.proyectoBase + '/api/car/list-all',
      listadoTarjetas: environment.proyectoBase + '/api/listcard',
      eliminarTarjeta: environment.proyectoBase + '/api/deletecard',
      agregarTarjeta: environment.proyectoBase + '/api/createcard',
      editarTarjeta: environment.proyectoBase + '/api/updatecard',
      pagarPrepago: environment.proyectoBase + '/api/license/hire-prepaidcard-license',
      pagarTarjeta: environment.proyectoBase + '/api/payment',
      pagarTransferencia: environment.proyectoBase + '/api/license/hire-transfer-license',
      validarMetodosPagos: environment.proyectoBase + '/api/license/list-payment-method'
    }
  };
  