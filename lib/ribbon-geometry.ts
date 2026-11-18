export type Vec3=[number,number,number];
export const ribbonShapes=['infinity','orbit','wave'] as const;
export type RibbonSettings={shape:typeof ribbonShapes[number];width:number;twist:number};
export const defaultRibbonSettings:RibbonSettings={shape:'infinity',width:.32,twist:.36};
export function sanitizeRibbonSettings(value:unknown):RibbonSettings{
  if(!value||typeof value!=='object')return {...defaultRibbonSettings};
  const v=value as Partial<RibbonSettings>;
  const finite=(n:unknown,min:number,max:number,fallback:number)=>typeof n==='number'&&Number.isFinite(n)?Math.max(min,Math.min(max,n)):fallback;
  return {shape:ribbonShapes.includes(v.shape as RibbonSettings['shape'])?v.shape!:defaultRibbonSettings.shape,width:finite(v.width,.18,.44,.32),twist:finite(v.twist,0,.9,.36)};
}
const cross=(a:Vec3,b:Vec3):Vec3=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const normalize=(v:Vec3):Vec3=>{const l=Math.hypot(...v)||1;return [v[0]/l,v[1]/l,v[2]/l]};
function center(u:number,shape:RibbonSettings['shape']):Vec3{
  const si=Math.sin(u),co=Math.cos(u);
  if(shape==='orbit')return [1.15*co,.76*si,.23*Math.sin(2*u)];
  if(shape==='wave')return [1.18*co,.68*si+.19*Math.sin(3*u),.32*Math.cos(2*u)];
  const d=1+.45*si*si;return [1.45*co*(1+.1*co)/d,1.4*si*co/d+.24*co,.54*si];
}
export function ribbonPoint(u:number,v:number,settings:RibbonSettings):Vec3{
  const p=center(u+.0001,settings.shape),q=center(u-.0001,settings.shape),t=normalize([p[0]-q[0],p[1]-q[1],p[2]-q[2]]);
  const side=normalize([-t[1],t[0],0]),binormal=cross(t,side),twist=u/2+settings.twist*Math.sin(u),co=Math.cos(twist),si=Math.sin(twist);
  const s:Vec3=[side[0]*co+binormal[0]*si,side[1]*co+binormal[1]*si,side[2]*co+binormal[2]*si],b=cross(t,s),cv=Math.cos(v),sv=Math.sin(v);
  const a=settings.width*Math.sign(cv)*Math.pow(Math.abs(cv),.46),d=.045*Math.sign(sv)*Math.pow(Math.abs(sv),.65),c=center(u,settings.shape);
  return [c[0]+s[0]*a+b[0]*d,c[1]+s[1]*a+b[1]*d,c[2]+s[2]*a+b[2]*d];
}
export function rotationAccent(x:number,y:number):Vec3{
  const hue=((260+((y-.42)+(x-.30)*.6)*180/Math.PI)%360+360)%360;
  const chroma=(1-Math.abs(2*.76-1))*.42,secondary=chroma*(1-Math.abs((hue/60)%2-1)),m=.76-chroma/2;
  const rgb:Vec3=hue<60?[chroma,secondary,0]:hue<120?[secondary,chroma,0]:hue<180?[0,chroma,secondary]:hue<240?[0,secondary,chroma]:hue<300?[secondary,0,chroma]:[chroma,0,secondary];
  return rgb.map(v=>Math.round((v+m)*255)) as Vec3;
}
