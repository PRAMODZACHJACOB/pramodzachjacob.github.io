import { z } from 'zod';
export const projectStyles=['coral','aqua','lilac','peach','mint','blue'] as const;
const projectLink=z.string().trim().max(1500).refine(value=>{if(!value)return true;try{return ['https:','http:'].includes(new URL(value).protocol)}catch{return false}},'Enter a full http or https URL.');
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
  title:`Project placeholder ${String(index+1).padStart(2,'0')}`,
  category:'',description:'',link:'',style,
}));
export const projectMutationSchema=z.object({entry:projectEntrySchema,revision:z.number().int().nonnegative(),projectId:z.string().max(100).optional()});
