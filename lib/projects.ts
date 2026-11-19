import { z } from 'zod';
export const projectStyles=['coral','aqua','lilac','peach','mint','blue'] as const;
const projectLink=z.string().trim().max(1500).refine(value=>{if(!value||value.startsWith('/')&&!value.startsWith('//'))return true;try{return ['https:','http:'].includes(new URL(value).protocol)}catch{return false}},'Enter a full http or https URL.');
export const projectEntrySchema=z.object({
  title:z.string().trim().min(1).max(160),
  category:z.string().trim().max(80),
  description:z.string().trim().max(1500),
  link:projectLink,
  cover:projectLink.optional(),
  style:z.enum(projectStyles),
});
export type ProjectEntry=z.infer<typeof projectEntrySchema>;
export type PortfolioProject=ProjectEntry & {id:string};
export const initialProjects:PortfolioProject[]=projectStyles.map((style,index)=>({
  id:`project-space-${String(index+1).padStart(2,'0')}`,
  title:index===0?'G-LIM Dishwasher Ad':index===1?'UNITY WATCH AD':index===2?'BREWLY COFFEE POWDER':index===3?'AL ANSARI EXCHANGE AD':`Project placeholder ${String(index+1).padStart(2,'0')}`,
  category:index<=3?'Advertisement':'',description:'',link:index===0?'/OUT_V2.mp4':index===1?'/watch_out_v2.mp4':index===2?'/Brewly%20ad%20V2.mp4':index===3?'/Reel_01_out.mp4':'',cover:index===0?'/glim-cover.jpeg':index===1?'/Unity%20Chronograph%20at%20Sunset.png':index===2?'/Brewly%20Golden%20Coffee%20Moment.png':index===3?'/Seamless%20Sunset%20Skyline%20Continuation.png':'',style,
}));
export const projectMutationSchema=z.object({entry:projectEntrySchema,revision:z.number().int().nonnegative(),projectId:z.string().max(100).optional()});
