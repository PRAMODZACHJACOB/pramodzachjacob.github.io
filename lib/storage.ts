import 'server-only';
import {getStore} from '@netlify/blobs';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
const local=()=>process.env.NODE_ENV!=='production'&&!process.env.NETLIFY;
const store=()=>getStore({name:process.env.CONTEXT==='deploy-preview'?'portfolio-preview':'portfolio',consistency:'strong'});
const file=(key:string)=>path.join(process.cwd(),'.local-data',Buffer.from(key).toString('hex'));
export type RecordValue<T>={data:T;etag:string};
export async function readRecord<T>(key:string):Promise<RecordValue<T>|null>{
 if(!local())return await store().getWithMetadata(key,{type:'json'}) as RecordValue<T>|null;
 try{const raw=await readFile(file(key),'utf8');return {data:JSON.parse(raw),etag:createHash('sha256').update(raw).digest('hex')}}catch(e){if((e as NodeJS.ErrnoException).code==='ENOENT')return null;throw e}
}
export async function writeRecord(key:string,value:unknown,etag:string|null){
 if(!local()){const result=await store().setJSON(key,value,etag?{onlyIfMatch:etag}:{onlyIfNew:true});return result.modified}
 const existing=await readRecord(key);if((existing?.etag??null)!==etag)return false;
 await mkdir(path.dirname(file(key)),{recursive:true});await writeFile(file(key),JSON.stringify(value));return true;
}
export async function readPDF(){
 if(!local())return await store().get('cv.pdf',{type:'arrayBuffer'});
 try{return new Uint8Array(await readFile(file('cv.pdf'))).buffer}catch(e){if((e as NodeJS.ErrnoException).code==='ENOENT')return null;throw e}
}
export async function writePDF(bytes:ArrayBuffer){
 if(!local()){await store().set('cv.pdf',bytes);return}
 await mkdir(path.dirname(file('cv.pdf')),{recursive:true});await writeFile(file('cv.pdf'),Buffer.from(bytes));
}
