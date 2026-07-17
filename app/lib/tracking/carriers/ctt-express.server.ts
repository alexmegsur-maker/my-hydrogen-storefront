// CTT Express "Servicios Web" — STUB (credenciales pendientes)
//
// ─── PREGUNTAR AL GESTOR COMERCIAL ANTES DE RECIBIR CREDENCIALES ─────────────
//
// 1. ¿REST o SOAP?
//    CTT tiene una API legacy en SOAP (WSDL) y está migrando a REST.
//    Pide explícitamente la URL base + Swagger/OpenAPI del entorno REST.
//    Si solo ofrecen WSDL, el adaptador requerirá un cliente SOAP (ej. "soap" npm).
//
// 2. Formato del código de seguimiento.
//    ¿Es el AWB que CTT asigna (tipo "ES00123456789CTT" o "34…")?
//    ¿O pueden ser referencias internas del cliente?
//    Necesitas saber qué campo enviar: `awb`, `barcode`, `reference`, etc.
//
// 3. Credenciales exactas.
//    ¿Basic Auth (username:password)?  ¿API Token en header?  ¿client_code + secret?
//    Según sus docs más recientes usan "cod_cliente" + "usuario" + "password".
//
// 4. Sandbox / pre-producción.
//    ¿Hay un entorno de pruebas con envíos reales o simulados?
//    Sin sandbox es muy difícil integrar sin errores en producción.
//
// 5. Rate limits y política de reintentos.
//    ¿Cuántas peticiones/minuto? ¿Hay backoff recomendado?
//
// 6. Push vs. polling.
//    ¿Tienen webhooks para notificaciones de estado?
//    Si no, ¿cada cuánto tiempo tienen sentido los polls?
// ─────────────────────────────────────────────────────────────────────────────

import type { NormalizedTracking } from '../types';
import { STATUS_LABELS } from '../types';

// Posible endpoint REST (confirmar con CTT antes de usar):
// const CTT_API_BASE = 'https://clientes.cttexpress.com/api/tracking';
//
// Posible payload:
// { cod_cliente: clientCode, usuario: username, password, expedicion: trackingNumber }
//
// Posibles estados CTT → NormalizedTracking:
// "ENTREGADO"          → 'delivered'
// "EN REPARTO"         → 'out_for_delivery'
// "EN TRANSITO"        → 'in_transit'
// "RECOGIDA"           → 'pre_transit'
// "DEVUELTO"           → 'exception'
// "NO ENTREGADO"       → 'failed'

export async function fetchCttExpress(
  trackingNumber: string,
  _clientCode?: string,
  _username?: string,
  _password?: string,
): Promise<NormalizedTracking> {
  // TODO: implementar cuando lleguen las credenciales
  return {
    carrier: 'CTT Express',
    trackingNumber,
    currentStatus: 'unknown',
    statusLabel: STATUS_LABELS.unknown,
    events: [],
    error: 'CTT Express: adaptador pendiente de credenciales',
  };
}
