import {sameOrigin,sessionCookie} from '../../../../lib/owner-auth';
export async function POST(request:Request){if(!sameOrigin(request))return Response.json({error:'Invalid origin.'},{status:403});return Response.json({ok:true},{headers:{'Set-Cookie':sessionCookie('',request,true),'Cache-Control':'no-store'}})}
