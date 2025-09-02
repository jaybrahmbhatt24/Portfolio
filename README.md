# Portfolio (HTML/CSS/JS)

A clean, responsive personal portfolio that showcases your Education (10, 12, and College), Projects, Professional Experience (internships), and Contact with Resume download.

## Quick Start

1. Open `index.html` in your browser.
2. Edit content in `script.js` under the `portfolioData` object.
3. Replace `assets/resume.pdf` with your actual PDF resume (use the same filename).

## Where to edit your info

- `script.js` → `portfolioData`
  - `profile`: name, role, summary, social links
  - `education`: add/update Class 10, Class 12, College
  - `projects`: title, description, tech, links
  - `experience`: internships/professional roles with period and highlights
  - `contact`: email, phone, location, `resumeUrl`

## Customize styles

Edit colors, spacing, and layout in `styles.css`. Dark/Light theme is built-in and persisted via `localStorage`.

## Deploy

- GitHub Pages
  1. Push this folder to a GitHub repository
  2. In repo Settings → Pages → Deploy from branch → `main` and `/ (root)`
  3. Wait a minute; your site will be live at `https://<your-username>.github.io/<repo>/`

- Netlify (drag & drop)
  1. Go to `https://app.netlify.com/drop`
  2. Drag this project folder; Netlify will deploy it

## Notes

- The navigation is mobile-friendly with a hamburger menu.
- Smooth scrolling and theme toggle are enabled.
- No backend is required. Everything is static.

# Portfolio