import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
let checked=0;
function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
  if(['.git','build','node_modules'].includes(entry.name))continue;
  const file=path.join(dir,entry.name);if(entry.isDirectory()){walk(file);continue;}
  if(!file.endsWith('.md'))continue;
  for(const match of fs.readFileSync(file,'utf8').matchAll(/\]\(([^)]+)\)/g)){
    let target=match[1];if(/^(https?:|mailto:|#)/.test(target))continue;
    target=decodeURIComponent(target.split('#')[0]);if(!target)continue;
    if(!fs.existsSync(path.resolve(path.dirname(file),target)))throw Error(`Broken link in ${path.relative(root,file)}: ${target}`);
    checked++;
  }
}}
walk(root);console.log(`PASS: ${checked} local documentation links resolve`);
