import {createHash,createHmac,timingSafeEqual,randomBytes} from 'node:crypto';
export const sessionName='portfolio_owner';
const duration=8*60*60;
function password(){const value=process.env.OWNER_PASSWORD;return value&&value.length>=16?value:null}
function digest(value:string){return createHash('sha256').update(value).digest()}
function signingKey(){const value=password();return value?digest('portfolio-session:'+value):null}
export function authConfigured(){return password()!==null}
export function checkPassword(value:unknown){const expected=password();return !!expected&&typeof value==='string'&&value.length<=512&&timingSafeEqual(digest(value),digest(expected))}
export function createSession(now=Date.now()){
 const key=signingKey();if(!key)throw new Error('Owner login is not configured');
 const payload=Buffer.from(JSON.stringify({expires:Math.floor(now/1000)+duration,nonce:randomBytes(24).toString('hex')})).toString('base64url');
 return `${payload}.${createHmac('sha256',key).update(payload).digest('base64url')}`;
}
export function verifySession(value:string,now=Date.now()){
 const key=signingKey();if(!key||value.length>1024)return false;
 try{const parts=value.split('.');if(parts.length!==2)return false;const [payload,signature]=parts,actual=Buffer.from(signature,'base64url'),expected=createHmac('sha256',key).update(payload).digest();if(actual.length!==expected.length||!timingSafeEqual(actual,expected))return false;
 const data=JSON.parse(Buffer.from(payload,'base64url').toString());return typeof data.expires==='number'&&data.expires>Math.floor(now/1000)&&data.expires<=Math.floor(now/1000)+duration;
 }catch{return false}
}
export function isOwner(request:Request){const cookie=request.headers.get('cookie')??'';const value=cookie.split(';').map(s=>s.trim()).find(s=>s.startsWith(sessionName+'='))?.slice(sessionName.length+1);return !!value&&verifySession(value)}
export function sameOrigin(request:Request){
 const origin=request.headers.get('origin');if(!origin)return false;
 const canonical=process.env.CONTEXT==='deploy-preview'||process.env.CONTEXT==='branch-deploy'?process.env.DEPLOY_PRIME_URL:process.env.URL;
 try{if(canonical)return origin===new URL(canonical).origin;const url=new URL(request.url),host=request.headers.get('host');return origin===url.origin||(process.env.NODE_ENV!=='production'&&!!host&&origin===`${url.protocol}//${host}`)}catch{return false}
}
export function sessionCookie(value:string,request:Request,clear=false){return `${sessionName}=${value}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${clear?0:duration}${new URL(request.url).protocol==='https:'?'; Secure':''}`}
