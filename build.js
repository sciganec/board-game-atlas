#!/usr/bin/env node
const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

const watch = process.argv.includes('--watch');

const html = (js) => `<!DOCTYPE html>
<html lang="uk">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>АТЛАС НАСТІЛЬНИХ ІГОР · SUBIT</title>
<meta name="description" content="Всесвітній атлас настільних ігор — 36 ігор від ~3100 до н.е. до 2017 н.е. SUBIT-класифікація, 9 ігрових столів із ШІ.">
<meta property="og:title" content="Атлас Настільних Ігор · SUBIT">
<meta property="og:description" content="36 ігор · 9 грабельних · SUBIT 64 архетипи · від Сенету до Carcassonne">
<meta property="og:type" content="website">
<style>
  @keyframes dotPulse {
    0%, 80%, 100% { transform: scaleY(.4); opacity: .3; }
    40%            { transform: scaleY(1);  opacity: 1;  }
  }
</style>
</head>
<body style="margin:0">
<div id="root"></div>
<script>${js}</script>
</body>
</html>`;

async function build() {
  if (!fs.existsSync('dist')) fs.mkdirSync('dist');

  const result = await esbuild.build({
    entryPoints: ['src/index.jsx'],
    bundle: true,
    minify: !watch,
    outfile: 'dist/bundle.js',
    loader: { '.jsx': 'jsx' },
    jsx: 'automatic',
    platform: 'browser',
    target: 'es2017',
    define: { 'process.env.NODE_ENV': watch ? '"development"' : '"production"' },
    metafile: true,
    write: true,
  });

  // Assemble single-file HTML
  const bundle = fs.readFileSync('dist/bundle.js', 'utf-8');
  fs.writeFileSync('dist/index.html', html(bundle));

  const size = fs.statSync('dist/index.html').size;
  console.log(`✓ dist/index.html  ${(size / 1024).toFixed(0)} KB`);

  if (result.metafile) {
    const inputs = Object.keys(result.metafile.inputs).length;
    console.log(`  ${inputs} modules bundled`);
  }
}

build().catch((e) => { console.error(e); process.exit(1); });
