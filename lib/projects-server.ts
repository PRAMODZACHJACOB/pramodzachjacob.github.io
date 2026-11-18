import {initialProjects,type PortfolioProject} from './projects';
import {readRecord} from './storage';
export async function readProjects(){const row=await readRecord<{projects:PortfolioProject[];revision:number}>('projects');return {projects:row?.data.projects??initialProjects,revision:row?.data.revision??0,etag:row?.etag??null}}
