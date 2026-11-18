'use client';
import {useCallback,useEffect,useState} from 'react';
import {ArrowUpRight,Pause,Move,RotateCcw} from 'lucide-react';
import Ribbon from './ribbon';
import {defaultRibbonSettings,sanitizeRibbonSettings,ribbonShapes,type RibbonSettings} from '../lib/ribbon-geometry';
export default function RibbonPlayground(){
  const [spin,setSpin]=useState(false),[reset,setReset]=useState(0),[settings,setSettings]=useState<RibbonSettings>(defaultRibbonSettings);
  useEffect(()=>{try{const saved=localStorage.getItem('zach-ribbon-settings');if(saved)setSettings(sanitizeRibbonSettings(JSON.parse(saved)))}catch{}},[]);
  useEffect(()=>{try{localStorage.setItem('zach-ribbon-settings',JSON.stringify(settings))}catch{}},[settings]);
  const changeShape=useCallback(()=>setSettings(s=>({...s,shape:ribbonShapes[(ribbonShapes.indexOf(s.shape)+1)%ribbonShapes.length]})),[]);
  function restore(){setSettings({...defaultRibbonSettings});setReset(v=>v+1);setSpin(false)}
  return <div className="hero-sculpture" id="playground">
    <svg className="drag-arc" viewBox="0 0 310 150" aria-hidden="true"><path d="M15 140 Q 120 -10 280 50" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="2 9"/></svg>
    <button className="spin-tooltip neu" aria-pressed={spin} onClick={()=>setSpin(v=>!v)}>{spin?'Pause the spin':'Give it a spin'}{spin?<Pause size={14}/>:<ArrowUpRight size={15}/>}</button>
    <div className="sculpture-platform" aria-hidden="true"/>
    <Ribbon spin={spin} reset={reset} settings={settings} onShapeChange={changeShape}/>
    <div className="sculpture-controls neu"><span><Move size={18}/>Drag to rotate</span><i/><button className="icon-button neu" aria-label="Reset ribbon position" onClick={restore}><RotateCcw size={19}/></button></div>
    <p className="ribbon-touch-hint">Tap the ribbon to change shape</p>
    <span className="visually-hidden" role="status">{settings.shape==='infinity'?'Infinity':settings.shape==='orbit'?'Orbit':'Wave'} ribbon</span>
  </div>;
}
