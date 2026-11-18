import {isOwner,sameOrigin} from '../../../../lib/owner-auth';
import {readPDF,writePDF} from '../../../../lib/storage';
export const dynamic='force-dynamic';
export async function GET(request:Request){try{const bytes=await readPDF();if(!bytes)return Response.redirect(new URL('/cv/pramod-zach-jacob.pdf',request.url),302);return new Response(bytes,{headers:{'Content-Type':'application/pdf','Content-Disposition':'attachment; filename="Pramod-Zach-Jacob-CV.pdf"','Cache-Control':'no-store'}})}catch{return Response.json({error:'PDF storage is unavailable.'},{status:503})}}
export async function POST(request:Request){
 if(!isOwner(request)||!sameOrigin(request))return Response.json({error:'Sign in as the owner to replace your PDF.'},{status:401});
 try{if(Number(request.headers.get('content-length'))>4.2*1024*1024)return Response.json({error:'Choose a PDF smaller than 4 MB.'},{status:413});const form=await request.formData(),file=form.get('file');
 if(!(file instanceof File)||file.size>4*1024*1024||file.size===0)return Response.json({error:'Choose a PDF smaller than 4 MB.'},{status:400});const bytes=await file.arrayBuffer();if(new TextDecoder().decode(bytes.slice(0,5))!=='%PDF-')return Response.json({error:'This file is not a valid PDF.'},{status:400});await writePDF(bytes);return Response.json({ok:true});
 }catch{return Response.json({error:'The PDF was not replaced. Please try again.'},{status:503})}
}
