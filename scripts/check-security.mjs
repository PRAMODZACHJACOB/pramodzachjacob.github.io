import assert from 'node:assert/strict';
import {randomBytes} from 'node:crypto';
import {authConfigured,checkPassword,createSession,verifySession,isOwner,sameOrigin,sessionCookie} from '../lib/owner-auth.ts';
const old=process.env.OWNER_PASSWORD;
try{
 delete process.env.OWNER_PASSWORD;assert.equal(authConfigured(),false);assert.equal(checkPassword('anything'),false);assert.equal(verifySession('forged'),false);
 process.env.OWNER_PASSWORD='short';assert.equal(authConfigured(),false);
 process.env.OWNER_PASSWORD=randomBytes(32).toString('hex');assert(checkPassword(process.env.OWNER_PASSWORD));assert(!checkPassword('wrong'));assert(!checkPassword({}));
 const now=Date.now(),token=createSession(now);assert(verifySession(token,now));assert(!verifySession(token,now+8*60*60*1000));assert(!verifySession(token+'x',now));
 const forged=Buffer.from(JSON.stringify({expires:Math.floor(now/1000)+100000})).toString('base64url')+'.'+token.split('.')[1];assert(!verifySession(forged,now));
 assert(!isOwner(new Request('https://portfolio.test',{headers:{'oai-authenticated-user-id':'owner','oai-authenticated-user-email':'owner@example.test'}})));
 assert(isOwner(new Request('https://portfolio.test',{headers:{cookie:'portfolio_owner='+token}})));
 assert(!sameOrigin(new Request('https://portfolio.test')));assert(!sameOrigin(new Request('https://portfolio.test',{headers:{origin:'https://attacker.test'}})));assert(sameOrigin(new Request('https://portfolio.test',{headers:{origin:'https://portfolio.test'}})));
 const cookie=sessionCookie(token,new Request('https://portfolio.test'));assert(cookie.includes('HttpOnly'));assert(cookie.includes('SameSite=Strict'));assert(cookie.includes('Secure'));
 process.env.OWNER_PASSWORD=randomBytes(32).toString('hex');assert(!verifySession(token,now));
 console.log('Owner configuration, password checks, signed sessions, expiry, tampering, header spoofing, cookie security, CSRF and credential rotation passed.');
}finally{if(old===undefined)delete process.env.OWNER_PASSWORD;else process.env.OWNER_PASSWORD=old}
