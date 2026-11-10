# Portfolio update guide

This update keeps the existing visual direction and replaces hardcoded content with JSON fetched from the `professional-profile` repository.

## Files to copy

Copy the contents of this package's `src/` directory into the existing portfolio project's `src/` directory, preserving the existing `main.jsx`, `SectionHeading.jsx`, and `ProjectVisual.jsx` unless the package provides an updated version. The updated `ProjectVisual.jsx` adds a research-assistant visual; the existing file must be replaced with this version.

The package intentionally does not include `package.json`, Vite configuration, `index.html`, or your `public/` assets because those were not included in the uploaded ZIP. Do not replace those files.

## 1. Prepare the central data repository

Create or update these files in `veck03/professional-profile/data/` using the JSON examples in `data-example/`:

- `profile.json`
- `education.json`
- `skills.json`
- `projects.json`

Check all URLs and project descriptions. The example leaves project GitHub and demo links blank rather than inventing them. Add real URLs before publishing. The AI Shopping Agent is included as a portfolio project based on the existing portfolio source; remove it if it is no longer a project you want to show.

Make the `professional-profile` repository public, then push the JSON files to its `main` branch.

## 2. Configure the portfolio

At the root of the existing Vite portfolio project, add the supplied `.env.production` file. It contains the public raw-data URL for `veck03/professional-profile`. This URL is not a secret, so it can be committed and will be available to the GitHub Pages build.

For local development, you can copy the same line into `.env.local`. Do not add a trailing slash. Restart the Vite development server after changing environment files. If your `.gitignore` excludes `.env.production`, force-add this one public configuration file or configure the same variable in your GitHub Actions workflow.

The code requests these four files:

- `${VITE_PROFILE_DATA_BASE_URL}/profile.json`
- `${VITE_PROFILE_DATA_BASE_URL}/education.json`
- `${VITE_PROFILE_DATA_BASE_URL}/skills.json`
- `${VITE_PROFILE_DATA_BASE_URL}/projects.json`

## 3. Replace the resume PDF

Put your latest resume PDF in the existing portfolio's `public/` directory and name it exactly:

`resume_2026.pdf`

The Hero, Navbar/contact area link to this file. If you use a different filename, update those paths in `Hero.jsx` and `Contact.jsx`.

Keep `profile.jpg` in `public/` if you want the existing portrait to continue appearing.

## 4. Run and verify

```bash
npm install
npm run dev
```

Verify:

- Projects load and the cards show correct descriptions and technologies.
- Education shows the correct dates and grades.
- Skills are grouped correctly.
- GitHub/LinkedIn links open the right profiles.
- Resume opens the latest PDF.
- No project card links to `https://github.com/` or `#`.

Then build:

```bash
npm run build
```

## 5. Important limitation

This version fetches public JSON at runtime. Changes to the JSON repository appear after the raw file is updated and the visitor reloads the portfolio (subject to CDN/browser caching). This does not automatically regenerate the PDF resume. Resume generation and cross-repository GitHub Actions should be a later phase.
