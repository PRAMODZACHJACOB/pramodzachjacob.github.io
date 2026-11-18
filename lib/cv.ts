import { z } from 'zod';
const entry = z.object({title:z.string().max(250),organization:z.string().max(250),period:z.string().max(100),details:z.string().max(4000)});
export const cvSchema = z.object({
  name:z.string().min(1).max(160), role:z.string().max(200), email:z.string().email(), phone:z.string().max(80), location:z.string().max(250), summary:z.string().max(6000),
  skills:z.array(z.string().max(100)).max(50), software:z.array(z.string().max(100)).max(50), languages:z.array(z.string().max(100)).max(25),
  experience:z.array(entry).max(40), education:z.array(entry).max(25),
});
export type CV = z.infer<typeof cvSchema>;
export const initialCV: CV = {
  name:'PRAMOD ZACH JACOB', role:'Compositor | Video Editor | AI Content Creator', email:'pramodzj@gmail.com', phone:'+91 9605098104', location:'Edayaranmula, Pathanamthitta, Kerala',
  summary:'Experienced Compositor and VFX Professional with a strong background in 2D/3D compositing, visual effects, motion graphics and post-production. Proficient in Adobe After Effects, Adobe Premiere Pro, Adobe Photoshop, Foundry Nuke and Blender, with experience working across animation, media and creative production environments. Skilled in visual integration, creative problem-solving and AI-assisted production workflows, with the ability to work independently and effectively within a team.',
  skills:['2D/3D Compositing','Visual Effects','VFX','AI Prompting','Motion Graphics','AI-Assisted Production','Post-Production','Creative Workflow'],
  software:['Adobe After Effects','Adobe Premiere Pro','Adobe Photoshop','Foundry Nuke','Blender'],
  languages:['English','Malayalam','Hindi','Tamil'],
  experience:[
    {title:'Cafe Co-Owner',organization:'Partnership · Pandalam, Pathanamthitta',period:'Mar 2026 – Present',details:'Manage day-to-day café operations and business activities as a partner.\nCoordinate operational, customer service and business-related responsibilities.'},
    {title:'Compositor',organization:'Zvoid · Ernakulam',period:'Feb 2022 – Feb 2026',details:'Worked on compositing and visual effects for creative production projects.\nHandled post-production tasks using industry-standard compositing tools.'},
    {title:'Freelance After Effects Artist',organization:'Freelance',period:'Jan 2020 – Jan 2022',details:'Created motion graphics, visual effects and compositing work using Adobe After Effects.\nDelivered creative post-production work based on project requirements.'},
    {title:'2D Compositor',organization:'Animac Studio',period:'Apr 2019 – Jan 2020',details:'Worked on 2D compositing and visual effects for animation projects.\nIntegrated visual elements and supported post-production workflows.'},
    {title:'Motion Graphics Artist',organization:'Key Frames',period:'Nov 2018 – Mar 2019',details:'Created motion graphics and visual content for production projects.\nWorked on animation and post-production requirements.'},
    {title:'Media Manager',organization:'Butterflies Nursery · Umm Al Quwain',period:'Sep 2017 – Mar 2018',details:'Managed media-related content and creative requirements.\nSupported visual content production and presentation activities.'},
    {title:'2D Compositor',organization:'ARIES EPICA',period:'Jan 2016 – Jul 2016',details:'Worked on 2D compositing and visual effects production.\nSupported animation and post-production workflows.'},
    {title:'2D Animation Compositor',organization:'Arty Animation',period:'Sep 2015 – Jan 2016',details:'Performed 2D compositing for animation projects.\nIntegrated visual elements for final production output.'},
    {title:'2D Compositor',organization:'Donna Penta Enterprises',period:'Jun 2015 – Sep 2015',details:'Worked on 2D compositing and animation projects.\nSupported visual effects and post-production activities.'},
    {title:'Freelance 3D Compositor',organization:'Vuega Animation',period:'Feb 2015 – Jun 2015',details:'Worked on 3D compositing and visual effects projects.\nAssisted in integrating 3D elements into final compositions.'},
    {title:'Online Channel',organization:'Malanadu',period:'Feb 2013 – Dec 2013',details:'Created and supported visual content for the online channel.\nWorked on titles, promotional content and lower-third designs.'}
  ],
  education:[
    {title:'Foundry Nuke Specialization',organization:'Green Matte Visual Effects Institute, Kochi',period:'2014',details:''},
    {title:'Adobe After Effects Specialization',organization:'Atom Multimedia, Coimbatore',period:'2011–2012',details:''},
    {title:'Professional Diploma in Multimedia',organization:'Keltron Animation Campus',period:'2010',details:''},
    {title:'Plus Two',organization:'A.M.M.H.S.S., Edayaranmula',period:'2007',details:''}
  ]
};
