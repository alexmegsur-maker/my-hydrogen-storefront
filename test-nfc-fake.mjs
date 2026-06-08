// test-nfc-fake.mjs
// Simula intentos de falsificación NFC contra el endpoint en producción.
// Propósito: verificar que la IP del atacante se registra en Shopify.
//
// Uso: node test-nfc-fake.mjs

const ENDPOINT = "https://phoenixchairs.eu/api/nfc-auth";

// UID real del chip pero MACs incorrectas → debe devolver FAKE
const FAKE_ATTEMPTS = [
  {
    label: "MAC todo ceros (falsificación obvia)",
    uid: "04680A32782390",
    ctr: "000018",
    mac: "0000000000000000",
  },
  {
    label: "MAC aleatoria 1",
    uid: "04680A32782390",
    ctr: "00001B",
    mac: "DEADBEEFCAFEBABE",
  },
  {
    label: "MAC aleatoria 2",
    uid: "04680A32782390",
    ctr: "000020",
    mac: "1122334455667788",
  },
  {
    label: "UID falso + MAC falsa",
    uid: "FFFFFFFFFFFF00",
    ctr: "000001",
    mac: "AABBCCDD11223344",
  },
];

async function runTest({ label, uid, ctr, mac }, index) {
  const url = `${ENDPOINT}?uid=${uid}&ctr=${ctr}&mac=${mac}`;
  console.log(`\n[Test ${index + 1}] ${label}`);
  console.log(`  URL: ${url}`);

  try {
    const res = await fetch(url);
    const json = await res.json();
    const status = json.status;
    const icon = status === "FAKE" ? "✓ FAKE detectado" : status === "SUCCESS" ? "⚠ SUCCESS (no esperado)" : `? ${status}`;
    console.log(`  Resultado: ${icon}`);
    console.log(`  HTTP: ${res.status} | Respuesta:`, JSON.stringify(json));
  } catch (err) {
    console.log(`  ✗ Error de red:`, err.message);
  }
}

console.log("=== TEST DE FALSIFICACIÓN NFC ===");
console.log(`Endpoint: ${ENDPOINT}`);
console.log(`Hora: ${new Date().toLocaleString("es-ES")}`);
console.log("Comprueba después en Shopify Admin → Metaobjects → alerta_falsificacion");
console.log("que aparecen los registros con tu IP actual.");

// Ejecutar tests en serie con pausa entre ellos para no saturar la API
for (let i = 0; i < FAKE_ATTEMPTS.length; i++) {
  await runTest(FAKE_ATTEMPTS[i], i);
  if (i < FAKE_ATTEMPTS.length - 1) {
    await new Promise(r => setTimeout(r, 1000));
  }
}

console.log("\n=== FIN DE TESTS ===");
console.log("Si los tests devuelven FAKE, revisa en Shopify:");
console.log("  Admin → Content → Metaobjects → alerta_falsificacion");
console.log("  Deben aparecer hasta 4 nuevas entradas con tu IP.");
