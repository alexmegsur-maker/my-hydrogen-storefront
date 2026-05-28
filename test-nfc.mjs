// test-nfc.mjs
// Ejecutar con: node test-nfc.mjs
//
// Este script implementa el mismo algoritmo que nfc-auth.ts
// y genera URLs de prueba para verificar que el endpoint responde correctamente.

// ─── Misma implementación crypto que el servidor ──────────────────────────────

async function aesBlock(key, block) {
  const cryptoKey = await crypto.subtle.importKey("raw", key, { name: "AES-CBC" }, false, ["encrypt"]);
  const enc = await crypto.subtle.encrypt({ name: "AES-CBC", iv: new Uint8Array(16) }, cryptoKey, block);
  return new Uint8Array(enc).slice(0, 16);
}

function xor16(a, b) { return new Uint8Array(16).map((_, i) => a[i] ^ b[i]); }

function shiftLeft(buf) {
  const out = new Uint8Array(buf.length);
  for (let i = 0; i < buf.length - 1; i++) out[i] = ((buf[i] << 1) | (buf[i + 1] >> 7)) & 0xff;
  out[buf.length - 1] = (buf[buf.length - 1] << 1) & 0xff;
  return out;
}

async function aesCmac(key, msg) {
  const Rb = new Uint8Array(16); Rb[15] = 0x87;
  const L = await aesBlock(key, new Uint8Array(16));
  const K1 = L[0] & 0x80 ? xor16(shiftLeft(L), Rb) : shiftLeft(L);
  const K2 = K1[0] & 0x80 ? xor16(shiftLeft(K1), Rb) : shiftLeft(K1);

  let n = Math.ceil(msg.length / 16);
  let complete;
  if (n === 0) { n = 1; complete = false; } else complete = msg.length % 16 === 0;

  let mLast;
  if (complete) {
    mLast = xor16(msg.slice((n - 1) * 16), K1);
  } else {
    const pad = new Uint8Array(16);
    const tail = msg.slice((n - 1) * 16);
    pad.set(tail); pad[tail.length] = 0x80;
    mLast = xor16(pad, K2);
  }

  let X = new Uint8Array(16);
  for (let i = 0; i < n - 1; i++) X = await aesBlock(key, xor16(X, msg.slice(i * 16, i * 16 + 16)));
  return aesBlock(key, xor16(X, mLast));
}

function fromHex(hex) {
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) out[i / 2] = parseInt(hex.slice(i, i + 2), 16);
  return out;
}

function toHex(b) {
  return Array.from(b).map(x => x.toString(16).padStart(2, "0")).join("").toUpperCase();
}

async function generateMac({ masterKey, uid, counter }) {
  const keyBytes = fromHex(masterKey);
  const uidBytes = fromHex(uid);
  let ctrBytes;
  if (/^[0-9a-fA-F]{6}$/.test(counter)) {
    ctrBytes = fromHex(counter);
  } else {
    const v = parseInt(counter, 10);
    ctrBytes = new Uint8Array([v & 0xff, (v >> 8) & 0xff, (v >> 16) & 0xff]);
  }
  const sv2 = new Uint8Array([0x3c, 0xc3, 0x00, 0x01, 0x00, 0x80, ...uidBytes, ...ctrBytes]);
  const sessionKey = await aesCmac(keyBytes, sv2);
  const fullMac = await aesCmac(sessionKey, new Uint8Array(0));
  const truncated = new Uint8Array(8);
  for (let i = 0; i < 8; i++) truncated[i] = fullMac[i * 2 + 1];
  return toHex(truncated);
}

// ─── Configuración de prueba ──────────────────────────────────────────────────
// ⚠️  Pon aquí tu NFC_MASTER_KEY real (32 hex chars = 16 bytes)
//     Ejemplos de UID y contador ficticios para dev

const MASTER_KEY = "7CF16E64936FA06B6F316E697EC2D032"; // ← cambia por tu clave real
const TEST_UID   = "04A72AAAAAAAAA"; // 14 hex chars (7 bytes)
const TEST_CTR   = "010000";         // contador 1 en hex LE

const BASE_URL   = "http://localhost:3456/api/nfc-auth";

// ─── Ejecutar pruebas ─────────────────────────────────────────────────────────

async function runTests() {
  console.log("=".repeat(60));
  console.log("  TEST NFC AUTH — NTAG 424 DNA AES-CMAC");
  console.log("=".repeat(60));

  // 1. Generar MAC válido
  const validMac = await generateMac({ masterKey: MASTER_KEY, uid: TEST_UID, counter: TEST_CTR });
  console.log(`\nMAC generado: ${validMac}`);

  // 2. Test SUCCESS — MAC correcto
  const urlOk = `${BASE_URL}?uid=${TEST_UID}&ctr=${TEST_CTR}&mac=${validMac}`;
  console.log(`\n[TEST 1] SUCCESS (MAC válido)`);
  console.log(`  URL: ${urlOk}`);
  const r1 = await fetch(urlOk);
  const j1 = await r1.json();
  console.log(`  Respuesta: ${JSON.stringify(j1)}`);
  console.log(`  ${j1.status === "SUCCESS" ? "✅ PASS" : "❌ FAIL"}`);

  // 3. Test FAKE — MAC incorrecto
  const fakeMac = "AABBCCDD11223344";
  const urlFake = `${BASE_URL}?uid=${TEST_UID}&ctr=${TEST_CTR}&mac=${fakeMac}`;
  console.log(`\n[TEST 2] FAKE (MAC incorrecto)`);
  console.log(`  URL: ${urlFake}`);
  const r2 = await fetch(urlFake);
  const j2 = await r2.json();
  console.log(`  Respuesta: ${JSON.stringify(j2)}`);
  console.log(`  ${j2.status === "FAKE" ? "✅ PASS" : "❌ FAIL"}`);

  // 4. Test INVALID_REQUEST — parámetros faltantes
  const urlBad = `${BASE_URL}?uid=${TEST_UID}`;
  console.log(`\n[TEST 3] INVALID_REQUEST (sin ctr ni mac)`);
  const r3 = await fetch(urlBad);
  const j3 = await r3.json();
  console.log(`  Respuesta: ${JSON.stringify(j3)}`);
  console.log(`  ${j3.status === "INVALID_REQUEST" ? "✅ PASS" : "❌ FAIL"}`);

  // 5. Test con contador distinto — debe dar FAKE (el contador cambia la session key)
  const macCtr1 = await generateMac({ masterKey: MASTER_KEY, uid: TEST_UID, counter: "010000" });
  const urlWrongCtr = `${BASE_URL}?uid=${TEST_UID}&ctr=020000&mac=${macCtr1}`;
  console.log(`\n[TEST 4] FAKE (MAC de ctr=1 enviado con ctr=2)`);
  const r4 = await fetch(urlWrongCtr);
  const j4 = await r4.json(); 
  console.log(`  Respuesta: ${JSON.stringify(j4)}`);
  console.log(`  ${j4.status === "FAKE" ? "✅ PASS" : "❌ FAIL"}`);
 
  console.log("\n" + "=".repeat(60));

  // 6. URL lista para pegar en el navegador o en el chip NFC de prueba
  console.log(`\n📎 URL válida para copiar/pegar en el navegador:`);
  console.log(`   ${urlOk}`);
}

runTests().catch(console.error);
