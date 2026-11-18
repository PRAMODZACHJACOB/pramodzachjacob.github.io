'use client';
import {useEffect,useRef,useState,type FormEvent} from 'react';
import {Plus,Pencil,ArrowUpRight,X,Check,Link as LinkIcon,RotateCcw} from 'lucide-react';
import {initialProjects,projectStyles,type PortfolioProject,type ProjectEntry} from '../lib/projects';
function withUploadedVideo(projects:PortfolioProject[]):PortfolioProject[]{
  return projects.map(project=>project.id==='project-space-01'&&!project.link&&project.title==='Project placeholder 01'?{...project,title:'G-LIM Dishwasher Ad',category:'Advertisement',link:'https://verdant-genie-c4ad12.netlify.app/OUT_V2.mp4'}:project);
}
function isVideo(link:string){try{return /\.(mp4|webm|ogv)$/i.test(new URL(link).pathname)}catch{return false}}
type ProjectResponse={projects:PortfolioProject[];revision:number;canEdit:boolean;error?:string};
export default function ProjectGallery(){
  const [projects,setProjects]=useState(withUploadedVideo(initialProjects)),[revision,setRevision]=useState(0),[canEdit,setCanEdit]=useState(false),[error,setError]=useState(''),[busy,setBusy]=useState(false),[opened,setOpened]=useState(false),[editingId,setEditingId]=useState<string|null>(null),[notice,setNotice]=useState('');
  const empty:ProjectEntry={title:'',category:'',description:'',link:'',cover:'',style:'coral'};
  const [draft,setDraft]=useState<ProjectEntry>(empty),original=useRef(''),dialog=useRef<HTMLDialogElement>(null);
  async function load(){
    try{const response=await fetch('/api/projects',{cache:'no-store'}),data=await response.json() as ProjectResponse;if(!response.ok)throw new Error(data.error);setProjects(withUploadedVideo(data.projects));setRevision(data.revision);setCanEdit(data.canEdit);setError('')}
    catch(e){setError(e instanceof Error?e.message:'Projects could not be loaded.')}
  }
  useEffect(()=>{load()},[]);
  useEffect(()=>{if(opened){dialog.current?.showModal();document.body.style.overflow='hidden'}else{dialog.current?.close();document.body.style.overflow=''}return()=>{document.body.style.overflow=''}},[opened]);
  useEffect(()=>{if(!notice)return;const timer=setTimeout(()=>setNotice(''),4500);return()=>clearTimeout(timer)},[notice]);
  function show(project?:PortfolioProject){
    if(!canEdit)return;
    const value:ProjectEntry=project?{title:project.title,category:project.category,description:project.description,link:project.link,cover:project.cover??'',style:project.style}:{...empty,title:`Project placeholder ${String(projects.length+1).padStart(2,'0')}`,style:projectStyles[projects.length%projectStyles.length]};
    setDraft(value);original.current=JSON.stringify(value);setEditingId(project?.id??null);setError('');setOpened(true);
  }
  function close(){if(busy)return;if(original.current!==JSON.stringify(draft)&&!confirm('Discard your unsaved project details?'))return;setOpened(false)}
  async function save(event:FormEvent){
    event.preventDefault();setBusy(true);setError('');
    try{const response=await fetch('/api/projects',{method:editingId?'PUT':'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({entry:draft,revision,projectId:editingId??undefined})});const data=await response.json() as ProjectResponse;if(!response.ok)throw new Error(data.error);setProjects(withUploadedVideo(data.projects));setRevision(data.revision);setCanEdit(data.canEdit);setOpened(false);setNotice(editingId?'Project updated.':'New project space added.')}
    catch(e){setError(e instanceof Error?e.message:'The project could not be saved.')}finally{setBusy(false)}
  }
  function card(project:PortfolioProject,index:number){
    const video=isVideo(project.link);
    const content=<>{video?<video key={project.link} controls playsInline preload="metadata" poster={project.cover||undefined} onLoadedMetadata={event=>{const video=event.currentTarget;if(video.videoWidth&&video.videoHeight)video.style.aspectRatio=`${video.videoWidth} / ${video.videoHeight}`}} aria-label={project.title} style={{display:'block',width:'100%',height:'auto',objectFit:'contain',borderRadius:19,background:'#111'}}><source src={project.link}/>Your browser cannot play this video. <a href={project.link}>Open video</a></video>:<div className={`abstract-art art-${project.style}`} aria-hidden="true"><i/><i/><i/><i/><b/></div>}<div className="project-caption"><div>{project.category&&<p className="project-category">{project.category}</p>}<h3>{project.title}</h3>{project.description&&<p className="project-description">{project.description}</p>}</div><span className="project-arrow icon-button neu" aria-hidden="true"><ArrowUpRight size={17}/></span></div></>;
    return <article className="project-card neu" key={project.id} style={{alignSelf:'start',minWidth:0}}>
      {project.link&&!video?<a className="project-card-main" href={project.link} target="_blank" rel="noopener noreferrer" aria-label={`Open ${project.title}`}>{content}</a>:<div className="project-card-main">{content}</div>}
      {canEdit&&<button className="project-edit icon-button neu" onClick={()=>show(project)} aria-label={`Edit project space ${index+1}`}>{project.link?<Pencil size={16}/>:<Plus size={20}/>}</button>}
    </article>
  }
  return <section className="section work-section" id="work">
    <div className="section-heading"><div><p className="eyebrow">A WORLD OF POSSIBILITIES</p><h2>Made to stand out<span>.</span></h2></div>{canEdit?<button className="button neu owner-add-project" onClick={()=>show()}><Plus size={18}/>Add project</button>:<span className="subtle-label">YOUR WORK GOES HERE</span>}</div>
    {error&&!opened&&<div className="project-load-error" role="alert">{error}<button className="text-link" onClick={load}><RotateCcw size={13}/>Reload projects</button></div>}
    <div className="project-grid">{projects.map(card)}</div>
    {canEdit&&<p className="owner-project-note">Your + controls are visible only to you. Add details to any space, or create another.</p>}
    {notice&&<p className="project-notice" role="status"><Check size={15}/>{notice}</p>}
    <dialog ref={dialog} className="project-dialog" aria-label={editingId?'Edit project space':'Add project space'} onCancel={e=>{e.preventDefault();close()}} onClick={e=>{if(e.target===e.currentTarget)close()}}>
      <form onSubmit={save} className="project-form">
        <div className="project-form-heading"><div><p className="eyebrow">YOUR WORK, YOUR WAY</p><h2>{editingId?'Make this space yours.':'Room for another idea.'}</h2></div><button type="button" className="icon-button" aria-label="Close project editor" onClick={close}><X size={21}/></button></div>
        <p className="project-form-note">Add your project details. Use a direct MP4 or WebM video link to play it inside this space.</p>
        {error&&<p className="error-banner" role="alert">{error}</p>}
        <label className="field"><span>Project title</span><input required maxLength={160} value={draft.title} onChange={e=>setDraft(d=>({...d,title:e.target.value}))}/></label>
        <label className="field"><span>Category (optional)</span><input maxLength={80} placeholder="e.g. AI video, animation, design" value={draft.category} onChange={e=>setDraft(d=>({...d,category:e.target.value}))}/></label>
        <label className="field"><span><LinkIcon size={12}/> Project link (optional)</span><input type="url" maxLength={1500} placeholder="https://" value={draft.link} onChange={e=>setDraft(d=>({...d,link:e.target.value}))}/></label>
        <label className="field"><span>Video cover image URL (optional)</span><input type="url" maxLength={1500} placeholder="https://your-site.com/cover.jpg" value={draft.cover??''} onChange={e=>setDraft(d=>({...d,cover:e.target.value}))}/><small>Shown before playback. Leave blank to use the video’s default preview.</small></label>
        <label className="field"><span>A few words about it (optional)</span><textarea rows={3} maxLength={1500} value={draft.description} onChange={e=>setDraft(d=>({...d,description:e.target.value}))}/></label>
        <fieldset className="project-style-picker"><legend>Choose a cover style</legend>{projectStyles.map(style=><button key={style} type="button" className={`style-swatch swatch-${style}`} aria-label={`${style} cover`} aria-pressed={draft.style===style} onClick={()=>setDraft(d=>({...d,style}))}>{draft.style===style&&<Check size={15}/>}</button>)}</fieldset>
        <div className="project-form-actions"><button type="button" className="button" onClick={close}>Cancel</button><button type="submit" className="button accent-button neu" disabled={busy}><Plus size={16}/>{busy?'Saving…':editingId?'Save project':'Add project space'}</button></div>
      </form>
    </dialog>
  </section>;
}
