import { parseProfileDocument } from '../src/profileIngest.js';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function buildSamplePdf() {
  const content = 'BT /F1 12 Tf 72 72 Td (Java Spring Boot Redis) Tj ET\n';
  const streamLen = Buffer.byteLength(content, 'latin1');
  const objects = [
    '1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n',
    '2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n',
    '3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 300 144]/Contents 4 0 R/Resources<</Font<</F1 5 0 R>>>>>>endobj\n',
    `4 0 obj<</Length ${streamLen}>>stream\n${content}endstream\nendobj\n`,
    '5 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj\n'
  ];

  let body = '%PDF-1.4\n';
  const offsets = [];
  for (const object of objects) {
    offsets.push(Buffer.byteLength(body, 'latin1'));
    body += object;
  }

  const xrefOffset = Buffer.byteLength(body, 'latin1');
  let xref = `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const offset of offsets) {
    xref += `${String(offset).padStart(10, '0')} 00000 n \n`;
  }

  body += `${xref}trailer<</Size ${objects.length + 1}/Root 1 0 R>>\nstartxref\n${xrefOffset}\n%%EOF`;
  return Buffer.from(body, 'latin1');
}

async function main() {
  const pdf = buildSamplePdf();
  const txt = await parseProfileDocument({
    fileName: 'resume.pdf',
    mimeType: 'application/pdf',
    contentBase64: pdf.toString('base64')
  });

  assert(txt.source === 'pdf', 'source should be pdf');
  assert(txt.text.includes('Java') || txt.text.includes('Spring'), `pdf text should include resume keywords, got: ${txt.text}`);
  assert(['pdf-parse'].includes(txt.parser), `parser should be pdf-parse, got: ${txt.parser}`);

  const json = await parseProfileDocument({
    fileName: 'profile.json',
    mimeType: 'application/json',
    contentBase64: Buffer.from(JSON.stringify({
      title: 'Java 后端',
      skills: ['Java', 'Redis'],
      projects: [{ name: '订单平台', role: '核心开发', highlights: ['库存扣减'] }]
    }), 'utf8').toString('base64')
  });

  assert(json.text.includes('订单平台'), 'json profile should be normalized');
  console.log(`profile ingest smoke passed (pdf parser: ${txt.parser})`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
