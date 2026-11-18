'use client';
import { useEffect, useRef, useState } from 'react';
import {ribbonPoint,rotationAccent,type RibbonSettings} from '../lib/ribbon-geometry';

type Vec3=[number,number,number];
const cross=(a:Vec3,b:Vec3):Vec3=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const sub=(a:Vec3,b:Vec3):Vec3=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]];
const normalize=(a:Vec3):Vec3=>{const n=Math.hypot(...a)||1;return [a[0]/n,a[1]/n,a[2]/n]};
const dot=(a:Vec3,b:Vec3)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
const defaultRotation={x:.30,y:.42,z:.06};
function Fallback(){return <svg className="ribbon-fallback" viewBox="0 0 620 420" aria-hidden="true"><defs><linearGradient id="ribbonIvory" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fffcff"/><stop offset=".6" stopColor="#ebe4f1"/><stop offset="1" stopColor="#bfb0d9"/></linearGradient><linearGradient id="ribbonLavender"><stop stopColor="#baacd7"/><stop offset="1" stopColor="#eee7f6"/></linearGradient></defs><path d="M100 240C125 120 235 345 340 235S520 45 530 150S412 332 306 235S85 140 100 240Z" fill="none" stroke="url(#ribbonLavender)" strokeWidth="64"/><path d="M100 240C85 140 215 170 306 235S510 311 530 150" fill="none" stroke="url(#ribbonIvory)" strokeWidth="64"/><circle cx="430" cy="127" r="25" fill="#f3e0a2"/></svg>}

export default function Ribbon({spin,reset,settings,onShapeChange}:{spin:boolean;reset:number;settings:RibbonSettings;onShapeChange:()=>void}){
  const canvas=useRef<HTMLCanvasElement>(null),rotation=useRef({...defaultRotation}),spinning=useRef(spin),dirty=useRef(true);const [ready,setReady]=useState(false);
  useEffect(()=>{spinning.current=spin;dirty.current=true},[spin]);
  useEffect(()=>{rotation.current={...defaultRotation};dirty.current=true},[reset]);
  useEffect(()=>{
    const element=canvas.current!,ctx=element.getContext('2d',{alpha:true});if(!ctx)return;
    // A cached 3D mesh, perspective projection and surface lighting work without a GPU context.
    const point=(u:number,v:number)=>ribbonPoint(u,v,settings);
    const vertices:Array<{p:Vec3;n:Vec3}>=[],faces:Array<{indices:number[];tone:number}>=[];const around=200,across=32,epsilon=.0001;
    for(let i=0;i<=around;i++)for(let j=0;j<=across;j++){
      const u=i/around*Math.PI*2,v=j/across*Math.PI*2;
      const tangent=sub(point(u+epsilon,v),point(u-epsilon,v)),perimeter=sub(point(u,v+epsilon),point(u,v-epsilon));
      vertices.push({p:point(u,v),n:normalize(cross(tangent,perimeter))});
      if(i<around&&j<across){const a=i*(across+1)+j,b=a+across+1;faces.push({indices:[a,b,b+1,a+1],tone:(Math.sin(v+Math.PI/across+u/2)+1)/2})}
    }
    const keyLight=normalize([-3,5,6]),fillLight=normalize([4,1,2]);
    let visible=true,dragging=false,moved=false,activePointer:number|null=null,startX=0,startY=0,lastX=0,lastY=0,frame=0,previousTime=0,lastPaint=0;
    const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
    const resize=()=>{const bounds=element.getBoundingClientRect(),dpr=Math.min(devicePixelRatio,2);element.width=Math.max(1,Math.round(bounds.width*dpr));element.height=Math.max(1,Math.round(bounds.height*dpr));dirty.current=true};
    const ro=new ResizeObserver(resize);ro.observe(element);resize();
    const io=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;dirty.current=true});io.observe(element);
    const down=(e:PointerEvent)=>{if(!e.isPrimary||e.button!==0||activePointer!==null)return;dragging=true;moved=false;activePointer=e.pointerId;startX=lastX=e.clientX;startY=lastY=e.clientY;element.setPointerCapture(e.pointerId)};
    const move=(e:PointerEvent)=>{if(!dragging||e.pointerId!==activePointer)return;if(!moved&&Math.hypot(e.clientX-startX,e.clientY-startY)<=8)return;moved=true;rotation.current.y+=(e.clientX-lastX)*.009;rotation.current.x+=(e.clientY-lastY)*.009;lastX=e.clientX;lastY=e.clientY;dirty.current=true};
    const finish=(e:PointerEvent,activate:boolean)=>{if(e.pointerId!==activePointer)return;const tapped=activate&&!moved&&Math.hypot(e.clientX-startX,e.clientY-startY)<=8;dragging=false;activePointer=null;if(element.hasPointerCapture(e.pointerId))element.releasePointerCapture(e.pointerId);if(tapped)onShapeChange()};
    const up=(e:PointerEvent)=>finish(e,true),cancel=(e:PointerEvent)=>finish(e,false);
    const click=(e:MouseEvent)=>{if(e.detail===0)onShapeChange()};
    const key=(e:KeyboardEvent)=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();if(!e.repeat)onShapeChange();return}if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();rotation.current.y+=e.key==='ArrowRight'?.13:e.key==='ArrowLeft'?-.13:0;rotation.current.x+=e.key==='ArrowDown'?.13:e.key==='ArrowUp'?-.13:0;dirty.current=true};
    element.addEventListener('pointerdown',down);element.addEventListener('pointermove',move);element.addEventListener('pointerup',up);element.addEventListener('pointercancel',cancel);element.addEventListener('lostpointercapture',cancel);element.addEventListener('click',click);element.addEventListener('keydown',key);
    function draw(time:number){
      frame=requestAnimationFrame(draw);const dt=Math.min(time-previousTime,45);previousTime=time;if(!visible||document.hidden)return;
      if(spinning.current&&!dragging&&!reduced){rotation.current.y+=dt*.00025;dirty.current=true}
      if(!dirty.current||time-lastPaint<30)return;lastPaint=time;dirty.current=false;
      const {x,y,z}=rotation.current,accent=rotationAccent(x,y),cx=Math.cos(x),sx=Math.sin(x),cy=Math.cos(y),sy=Math.sin(y),cz=Math.cos(z),sz=Math.sin(z);
      const rotate=([px,py,pz]:Vec3):Vec3=>{const yy=py*cx-pz*sx,zz=py*sx+pz*cx,xx=px*cy+zz*sy,z2=-px*sy+zz*cy;return [xx*cz-yy*sz,xx*sz+yy*cz,z2]};
      const w=element.width,h=element.height,focal=h/(2*Math.tan(.53/2));
      const project=(p:Vec3)=>{const k=focal/(5.8-p[2]);return {x:w/2+p[0]*k,y:h*.46-p[1]*k,z:p[2]}};
      const transformed=vertices.map(v=>({screen:project(rotate(v.p)),normal:rotate(v.n)}));
      const renderFaces=faces.map(face=>{const ps=face.indices.map(i=>transformed[i]);const depth=ps.reduce((s,p)=>s+p.screen.z,0)/4;return {ps,depth,tone:face.tone,sphere:false}});
      const sphereWorld=rotate([.88,.48,.35]),sphere=project(sphereWorld),sphereRadius=.175*focal/(5.8-sphereWorld[2]);
      renderFaces.push({ps:[],depth:sphere.z,tone:1,sphere:true});renderFaces.sort((a,b)=>a.depth-b.depth);
      ctx!.clearRect(0,0,w,h);
      for(const face of renderFaces){
        if(face.sphere){const gradient=ctx!.createRadialGradient(sphere.x-sphereRadius*.4,sphere.y-sphereRadius*.44,sphereRadius*.05,sphere.x,sphere.y,sphereRadius);gradient.addColorStop(0,'#fff8d4');gradient.addColorStop(.38,'#f8e7a3');gradient.addColorStop(.8,'#eed47d');gradient.addColorStop(1,'#dac17a');ctx!.beginPath();ctx!.arc(sphere.x,sphere.y,sphereRadius,0,Math.PI*2);ctx!.fillStyle=gradient;ctx!.fill();continue}
        const ps=face.ps,avg=normalize(ps.reduce<Vec3>((s,p)=>[s[0]+p.normal[0],s[1]+p.normal[1],s[2]+p.normal[2]],[0,0,0]));
        if(avg[2]<0){avg[0]*=-1;avg[1]*=-1;avg[2]*=-1}
        const light=.70+.31*Math.max(0,dot(avg,keyLight))+.10*Math.max(0,dot(avg,fillLight)),spec=Math.pow(Math.max(0,dot(avg,normalize([-.3,.5,1]))),40)*14;
        const t=face.tone,ivory=[248,242,249],base=accent.map((value,i)=>value+(ivory[i]-value)*t);
        const color=base.map(v=>Math.round(Math.min(255,v*light+spec)));
        ctx!.beginPath();ps.forEach((p,i)=>i?ctx!.lineTo(p.screen.x,p.screen.y):ctx!.moveTo(p.screen.x,p.screen.y));ctx!.closePath();ctx!.fillStyle=`rgb(${color.join(',')})`;ctx!.strokeStyle=ctx!.fillStyle;ctx!.lineWidth=.65;ctx!.fill();ctx!.stroke();
      }
    }
    frame=requestAnimationFrame(draw);setReady(true);
    return()=>{cancelAnimationFrame(frame);ro.disconnect();io.disconnect();element.removeEventListener('pointerdown',down);element.removeEventListener('pointermove',move);element.removeEventListener('pointerup',up);element.removeEventListener('pointercancel',cancel);element.removeEventListener('lostpointercapture',cancel);element.removeEventListener('click',click);element.removeEventListener('keydown',key)};
  },[settings.shape,settings.width,settings.twist,onShapeChange]);
  return <div className={`ribbon-render ${ready?'is-ready':''}`}><Fallback/><canvas ref={canvas} className="ribbon-canvas" role="button" tabIndex={0} aria-label={`${settings.shape==='infinity'?'Infinity':settings.shape==='orbit'?'Orbit':'Wave'} ribbon. Tap or click to change shape; drag or use arrow keys to rotate.`} aria-describedby="ribbon-keyboard-help"/><span className="visually-hidden" id="ribbon-keyboard-help">Press Enter or Space to change shape. The yellow sphere and ribbon rotate together. Use reset to return to the original view.</span></div>;
}
