import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const version=fs.readFileSync(path.join(root,'firmware/CMakeLists.txt'),'utf8').match(/set\(PROJECT_VER "([^"]+)"/)?.[1];
const documented=fs.readFileSync(path.join(root,'README.md'),'utf8').match(/Current firmware: \*\*v([\d.]+)\*\*/)?.[1];
if(!version||documented!==version)throw Error('README current firmware must match firmware/CMakeLists.txt');
let checked=0;
function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
  if(['.git','build','node_modules','release','managed_components'].includes(entry.name))continue;
  const file=path.join(dir,entry.name);if(entry.isDirectory()){walk(file);continue;}
  if(!file.endsWith('.md'))continue;
  const prose=fs.readFileSync(file,'utf8').replace(/^```[^\n]*\n[\s\S]*?^```[^\n]*/gm,'');
  for(const match of prose.matchAll(/\]\(([^)]+)\)/g)){
    let target=match[1];if(/^(https?:|mailto:|#)/.test(target))continue;
    target=decodeURIComponent(target.split('#')[0]);if(!target)continue;
    if(!fs.existsSync(path.resolve(path.dirname(file),target)))throw Error(`Broken link in ${path.relative(root,file)}: ${target}`);
    checked++;
  }
}}
walk(root);console.log(`PASS: ${checked} local documentation links resolve`);
