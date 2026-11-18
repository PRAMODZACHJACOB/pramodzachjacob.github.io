import {initialCV,type CV} from './cv';
import {readRecord} from './storage';
export {isOwner,sameOrigin} from './owner-auth';
export async function readCV(){const row=await readRecord<{cv:CV;revision:number}>('cv');return {cv:row?.data.cv??initialCV,revision:row?.data.revision??0,etag:row?.etag??null}}
