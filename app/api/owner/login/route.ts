import {createHash} from 'node:crypto';
import {authConfigured,checkPassword,createSession,sameOrigin,sessionCookie} from '../../../../lib/owner-auth';
import {readRecord,writeRecord} from '../../../../lib/storage';
export const dynamic='force-dynamic';
async function allowAttempt(request:Request){
 const ip=request.headers.get('x-nf-client-connection-ip')??'local',key='login-'+createHash('sha256').update(ip).digest('hex'),window=Math.floor(Date.now()/600000);
 for(let i=0;i<3;i++){const row=await readRecord<{window:number;attempts:number}>(key),attempts=row?.data.window===window?row.data.attempts:0;if(attempts>=10)return false;if(await writeRecord(key,{window,attempts:attempts+1},row?.etag??null))return true}return false;
}
export async function POST(request:Request){
 if(!sameOrigin(request))return Response.json({error:'Open the login page on this website.'},{status:403});
 if(!authConfigured())return Response.json({error:'Owner login needs to be configured in hosting settings.'},{status:503});
 try{if(!await allowAttempt(request))return Response.json({error:'Too many attempts. Please try again in 10 minutes.'},{status:429,headers:{'Retry-After':'600'}});const text=await request.text();if(text.length>2000)return Response.json({error:'Invalid password.'},{status:400});const body=JSON.parse(text);if(!checkPassword(body.password))return Response.json({error:'The password is incorrect.'},{status:401});
 return Response.json({ok:true},{headers:{'Set-Cookie':sessionCookie(createSession(),request),'Cache-Control':'no-store'}});
 }catch{return Response.json({error:'Sign-in is unavailable. Please try again.'},{status:503})}
}
