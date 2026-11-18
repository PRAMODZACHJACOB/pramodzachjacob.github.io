# Zach Jacob portfolio
Static Next.js portfolio for GitHub Pages. No Netlify account or server is required.

## Publish
1. Rename this repository to `pramodzachjacob.github.io` for the address https://pramodzachjacob.github.io/.
2. On GitHub Free, the repository must be public to use Pages. Review repository contents and history before changing visibility.
3. In Settings → Pages, select GitHub Actions as the source.
4. Run the Publish portfolio to GitHub Pages workflow from Actions. Future pushes to main publish automatically.

The workflow also supports the original repository name using a project URL.

## Update work
Upload videos and cover images to `public/`. Edit `initialProjects` in `lib/projects.ts` to set title, category, description, link and cover. Use paths such as `/OUT_V2.mp4` and `/glim-cover.jpeg`.
Edit `lib/cv.ts` for web CV text. Replace `public/cv/pramod-zach-jacob.pdf` for the download.
Video frames follow native proportions; cover images fill the frame with cropping as needed.
Owner sign-in and server editing have been removed.

## Local checks
`npm ci`
`npm run build`
The static output is in `out/`.
