'use client';
import {ArrowUpRight} from 'lucide-react';
import {initialProjects,type PortfolioProject} from '../lib/projects';
import {assetPath} from '../lib/assets';
function isVideo(link:string){return /\.(mp4|webm|ogv)(?:[?#]|$)/i.test(link)}
export default function ProjectGallery(){
  function card(project:PortfolioProject,index:number){
    const video=isVideo(project.link);
    const content=<>{video?<video key={project.link} controls playsInline preload="metadata" poster={project.cover?assetPath(project.cover):undefined} onLoadedMetadata={event=>{const video=event.currentTarget;if(video.videoWidth&&video.videoHeight)video.style.aspectRatio=`${video.videoWidth} / ${video.videoHeight}`}} aria-label={project.title} style={{display:'block',width:'100%',height:'auto',objectFit:'cover',borderRadius:19,background:'#111'}}><source src={assetPath(project.link)}/>Your browser cannot play this video. <a href={assetPath(project.link)}>Open video</a></video>:<div className={`abstract-art art-${project.style}`} aria-hidden="true"><i/><i/><i/><i/><b/></div>}<div className="project-caption"><div>{project.category&&<p className="project-category">{project.category}</p>}<h3>{project.title}</h3>{project.description&&<p className="project-description">{project.description}</p>}</div><span className="project-arrow icon-button neu" aria-hidden="true"><ArrowUpRight size={17}/></span></div></>;
    return <article className="project-card neu" key={project.id} style={{alignSelf:'start',minWidth:0}}>
      {project.link&&!video?<a className="project-card-main" href={assetPath(project.link)} target="_blank" rel="noopener noreferrer" aria-label={`Open ${project.title}`}>{content}</a>:<div className="project-card-main">{content}</div>}
    </article>
  }
  return <section className="section work-section" id="work">
    <div className="section-heading"><div><p className="eyebrow">A WORLD OF POSSIBILITIES</p><h2>Made to stand out<span>.</span></h2></div></div>
    <div className="project-grid">{initialProjects.map(card)}</div>
  </section>;
}
