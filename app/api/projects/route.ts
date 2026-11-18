import {isOwner,sameOrigin} from '../../../lib/owner-auth';
import {readProjects} from '../../../lib/projects-server';
import {projectMutationSchema} from '../../../lib/projects';
import {writeRecord} from '../../../lib/storage';
export const dynamic='force-dynamic';
export async function GET(request:Request){try{const current=await readProjects();return Response.json({projects:current.projects,revision:current.revision,canEdit:isOwner(request)},{headers:{'Cache-Control':'no-store'}})}catch{return Response.json({error:'Projects could not be loaded. Please try again.'},{status:503})}}
async function mutate(request:Request,editing:boolean){
 if(!isOwner(request)||!sameOrigin(request))return Response.json({error:'Sign in as the owner to manage projects.'},{status:401});
 try{const text=await request.text();if(text.length>10000)return Response.json({error:'The project is too large.'},{status:413});const parsed=projectMutationSchema.safeParse(JSON.parse(text));if(!parsed.success)return Response.json({error:'Check the title and project link.'},{status:400});
 const current=await readProjects(),{entry,revision,projectId}=parsed.data;
 if(revision!==current.revision)return Response.json({error:'Projects changed. Reload before saving.'},{status:409});
 if(editing&&!current.projects.some(p=>p.id===projectId))return Response.json({error:'Project space was not found.'},{status:404});
 if(!editing&&current.projects.length>=60)return Response.json({error:'You can keep up to 60 spaces.'},{status:400});
 const projects=editing?current.projects.map(p=>p.id===projectId?{...entry,id:p.id}:p):[...current.projects,{...entry,id:crypto.randomUUID()}];
 if(!await writeRecord('projects',{projects,revision:revision+1},current.etag))return Response.json({error:'Projects changed. Reload and try again.'},{status:409});return Response.json({projects,revision:revision+1,canEdit:true});
 }catch{return Response.json({error:'Your project was not saved. Please try again.'},{status:503})}
}
export async function POST(request:Request){return mutate(request,false)}
export async function PUT(request:Request){return mutate(request,true)}
