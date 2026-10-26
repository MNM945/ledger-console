import {readFile,writeFile,mkdir} from 'node:fs/promises';
const docs={};
for(const path of ['README.md','docs/CASE_STUDY.md','docs/COMPONENT_GUIDE.md','docs/I18N_ACCESSIBILITY.md','docs/IMPLEMENTATION_HANDOFF.md','docs/VALIDATION.md']) docs[path]=await readFile(new URL(`../${path}`,import.meta.url),'utf8');
await mkdir(new URL('../src/examples/',import.meta.url),{recursive:true});
await writeFile(new URL('../src/examples/docs.generated.json',import.meta.url),JSON.stringify(docs));
