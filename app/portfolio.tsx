'use client';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ArrowDown, Sun, Moon, Plus, Minus, X, Download, Printer, Pencil, Check, Mail, Upload, FileText, Copy } from 'lucide-react';
import { initialCV, type CV } from '../lib/cv';
import RibbonPlayground from './ribbon-playground';
import ProjectGallery from './project-gallery';
import {assetPath} from '../lib/assets';

function CVPaper({cv}:{cv:CV}) {
  return <article className="cv-paper" id="cv-document">
    <header className="resume-header"><p className="resume-label">CURRICULUM VITAE</p><h1>{cv.name}</h1><p className="resume-role">{cv.role}</p><p className="resume-contact"><a href={`mailto:${cv.email}`}>{cv.email}</a> · {cv.phone}<br/>{cv.location}</p></header>
    <section><h2>Profile</h2><p>{cv.summary}</p></section>
    <section><h2>Core skills</h2><p>{cv.skills.join(' · ')}</p></section>
    <section><h2>Professional experience</h2>{cv.experience.map((e,i)=><div className="resume-entry" key={i}><div><h3>{e.title}</h3><time>{e.period}</time></div><h4>{e.organization}</h4>{e.details.split('\n').filter(Boolean).map((d,j)=><p key={j}>{d}</p>)}</div>)}</section>
    <section><h2>Education</h2>{cv.education.map((e,i)=><div className="resume-entry" key={i}><div><h3>{e.title}</h3><time>{e.period}</time></div><p>{e.organization}</p>{e.details&&<p>{e.details}</p>}</div>)}</section>
    <div className="resume-bottom"><section><h2>Software</h2><p>{cv.software.join(' · ')}</p></section><section><h2>Languages</h2><p>{cv.languages.join(' · ')}</p></section></div>
  </article>;
}

export default function Portfolio(){
  const cv=initialCV;
  const [dark,setDark]=useState(false);const [open,setOpen]=useState(false);const [toast,setToast]=useState('');const [menu,setMenu]=useState(false);const [active,setActive]=useState('home');
  const [paperOpening,setPaperOpening]=useState(false);const paperTimer=useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(()=>()=>{if(paperTimer.current)clearTimeout(paperTimer.current)},[]);
  const dialog=useRef<HTMLDialogElement>(null);const firstLoad=useRef(true);
  useEffect(()=>{setDark(localStorage.getItem('zach-theme')==='dark');},[]);
  useEffect(()=>{document.documentElement.dataset.theme=dark?'dark':'light';if(!firstLoad.current)localStorage.setItem('zach-theme',dark?'dark':'light');firstLoad.current=false},[dark]);
  useEffect(()=>{if(!toast)return;const id=setTimeout(()=>setToast(''),4500);return()=>clearTimeout(id)},[toast]);
  useEffect(()=>{if(open){dialog.current?.showModal();document.body.style.overflow='hidden'}else{dialog.current?.close();document.body.style.overflow=''}return()=>{document.body.style.overflow=''}},[open]);
  useEffect(()=>{const observer=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting)setActive(e.target.id)})},{rootMargin:'-20% 0px -55% 0px'});document.querySelectorAll('main > section[id]').forEach(el=>observer.observe(el));return()=>observer.disconnect()},[]);
  const toggleTheme=()=>setDark(v=>!v);
  const openCV=()=>{setOpen(true)};
  const unfoldPaper=()=>{if(paperOpening)return;setPaperOpening(true);paperTimer.current=setTimeout(()=>{openCV();setPaperOpening(false)},650)};
  const closeCV=()=>setOpen(false);
  async function copyEmail(){try{await navigator.clipboard.writeText(cv.email);setToast('Email address copied.')}catch{setToast(`Email me at ${cv.email}`)}}

  return <>
    <div className="ambient" aria-hidden="true"/>
    <header className="site-header shell">
      <a className="brand" href="#home" aria-label="Zach Jacob home"><span className="brand-mark neu">ZJ<span/></span><span>ZACH JACOB<span className="brand-dot">.</span></span></a>
      <nav className={`nav neu ${menu?'nav-open':''}`} aria-label="Main navigation">{[['home','Home'],['work','Work'],['about','About'],['playground','Playground'],['cv','My CV']].map(([id,label])=><a key={id} href={`#${id}`} className={active===id?'active':''} aria-current={active===id?'page':undefined} onClick={()=>setMenu(false)}>{label}</a>)}</nav>
      <div className="header-actions"><button className="icon-button neu" aria-label={dark?'Switch to light theme':'Switch to dark theme'} onClick={toggleTheme}>{dark?<Moon size={19}/>:<Sun size={20}/>}</button><a className="button neu contact-button" href="#contact">Let’s talk <ArrowUpRight size={17}/></a><button className="icon-button neu menu-button" onClick={()=>setMenu(v=>!v)} aria-label="Toggle navigation" aria-expanded={menu}>{menu?<X size={20}/>:<span className="menu-lines"/>}</button></div>
    </header>
    <main className="shell">
      <section className="hero ribbon-hero" id="home">
        <div className="hero-copy">
          <p className="eyebrow"><span className="tiny-dot"/>HELLO, I’M ZACH</p>
          <h1><span className="hero-line">A little curious.</span><span className="hero-line">A lot <em>creative.</em></span></h1>
          <p className="hero-description">A curious mind. A fresh perspective. A little unexpected.</p>
          <div className="hero-buttons"><a className="button accent-button neu" href="#work">Explore my work <ArrowUpRight size={18}/></a><button className="text-button" onClick={openCV}><span className="icon-button neu"><FileText size={19}/></span>Unfold my CV</button></div>
        </div>
        <RibbonPlayground/>
      </section>
      <a href="#work" className="scroll-line"><span/>SCROLL FOR THE GOOD STUFF <ArrowDown size={14}/><span/></a>

      <ProjectGallery/>

      <section className="section cv-section" id="cv"><div className="cv-intro"><p className="eyebrow">THERE’S A STORY IN EVERY FOLD</p><h2>My journey. <br/><span>Unfolded.</span></h2><p>The experience. The skills. The story.</p><div className="cv-actions"><button className="button neu accent-button" onClick={openCV}>Unfold my CV <ArrowUpRight size={17}/></button><a className="text-link" href={assetPath('/cv/pramod-zach-jacob.pdf')} download>Download PDF <Download size={16}/></a></div></div>
        <div className="paper-desk inset"><span className="desk-label">A PAPER TRAIL, WITH PERSONALITY.</span><button className={`folded-paper ${paperOpening?'paper-opening':''}`} onClick={unfoldPaper} aria-label="Unfold and read Zach's complete CV"><div className="fold-top"><span className="paper-kicker">CURRICULUM VITAE</span><h3><span className="paper-first-name">{cv.name.trim().split(/\s+/)[0]}</span>{cv.name.trim().split(/\s+/).slice(1).join(' ')}<span>.</span></h3><p>{cv.role.split('|').slice(0,2).join(' · ')}{cv.role.split('|').length>2&&<><br/>{cv.role.split('|').slice(2).join(' · ')}</>}</p></div><div className="fold-middle"><span>EXPERIENCE &amp; SKILLS</span><i/><i/><i/></div><div className="fold-bottom"><span>Made of experience.<br/>Open to possibility.</span><span className="paper-round"><Plus size={20}/></span></div></button><span className="paper-hint">Click to unfold <ArrowUpRight size={15}/></span></div>
      </section>

      <section className="section about-section" id="about"><div className="about-intro"><p className="eyebrow">MORE THAN A JOB TITLE</p><h2>Craft meets <br/><span>curiosity.</span></h2><a className="text-link" href="#cv">Get to know my story <ArrowDown size={16}/></a></div><div className="about-body"><p className="large-copy">I’m Zach, a compositor, video editor and AI content creator based in Kerala, India.</p><p>I bring together visual integration, post-production and creative problem-solving. My background spans animation, media and creative production, with AI-assisted workflows opening new possibilities along the way.</p><div className="skill-pills">{['Compositing','Video editing','AI-assisted creation','Visual storytelling'].map(t=><span className="neu" key={t}>{t}</span>)}</div><div className="tools-line"><span>THE CREATIVE TOOLKIT</span><p>After Effects <i/> Premiere Pro <i/> Photoshop <i/> Nuke <i/> Blender</p></div></div></section>

      <section className="section contact-section" id="contact"><p className="eyebrow">GOOD THINGS START WITH A HELLO</p><h2>Got an idea?<br/>Let’s make it <span>something.</span></h2><div className="contact-actions"><a className="button neu accent-button" href={`mailto:${cv.email}`}>Say hello <Mail size={18}/></a><button className="text-button email-copy" onClick={copyEmail}>{cv.email}<Copy size={14}/></button></div><p className="contact-location">Based in Kerala, India. Creating beyond boundaries.</p></section>
    </main>
    <footer className="shell site-footer"><a className="footer-wordmark" href="#home">ZACH JACOB<span>.</span></a><p>A little curious. A lot creative.</p><span>© {new Date().getFullYear()} Zach Jacob</span><a className="back-top icon-button neu" href="#home" aria-label="Back to top"><ArrowUpRight size={18}/></a></footer>
    {toast&&<div className="toast neu" role="status"><Check size={16}/>{toast}</div>}
    <dialog className="cv-modal" aria-label="Zach Jacob curriculum vitae" ref={dialog} onCancel={e=>{e.preventDefault();closeCV()}} onClick={e=>{if(e.target===e.currentTarget)closeCV()}}>
      <div className="cv-window"><div className="cv-toolbar"><span><FileText size={17}/>The story so far.</span><div><><a className="toolbar-button" href={assetPath('/cv/pramod-zach-jacob.pdf')} download><Download size={15}/><span>PDF</span></a><button className="toolbar-button" onClick={()=>window.print()}><Printer size={15}/><span>Print / Save PDF</span></button></><button className="icon-button" aria-label="Close CV" onClick={closeCV}><X size={22}/></button></div></div>
        <CVPaper cv={cv}/>
      </div>
    </dialog>
  </>;
}
