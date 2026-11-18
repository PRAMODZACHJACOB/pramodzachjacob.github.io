import {cvSchema} from '../../../lib/cv';
import {readCV,isOwner,sameOrigin} from '../../../lib/cv-server';
import {writeRecord} from '../../../lib/storage';
export const dynamic='force-dynamic';
export async function GET(request:Request){try{const data=await readCV();return Response.json({cv:data.cv,revision:data.revision,canEdit:isOwner(request)},{headers:{'Cache-Control':'no-store'}})}catch{return Response.json({error:'The CV could not be loaded. Please try again.'},{status:503})}}
export async function PUT(request:Request){
 if(!isOwner(request)||!sameOrigin(request))return Response.json({error:'Sign in as the owner to save changes.'},{status:401});
 try{const text=await request.text();if(text.length>150000)return Response.json({error:'The CV is too large.'},{status:413});const body=JSON.parse(text),parsed=cvSchema.safeParse(body.cv);
 if(!parsed.success||!Number.isInteger(body.revision)||body.revision<0)return Response.json({error:'Check the CV fields and try again.'},{status:400});
 const current=await readCV();if(current.revision!==body.revision)return Response.json({error:'The CV changed. Reload before saving.'},{status:409});
 const revision=current.revision+1;if(!await writeRecord('cv',{cv:parsed.data,revision},current.etag))return Response.json({error:'A newer CV was saved. Reload and try again.'},{status:409});return Response.json({cv:parsed.data,revision,canEdit:true});
 }catch{return Response.json({error:'Your changes were not saved. Please try again.'},{status:503})}
}
