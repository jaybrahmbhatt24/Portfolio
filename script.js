const portfolioData = {
  profile: {
    name: "Your Name",
    role: "Student • Developer",
    summary:
      "Enthusiastic developer with a passion for building user-centric solutions. Interested in web, data, and problem solving.",
    socials: [
      { label: "GitHub", url: "https://github.com/your-username" },
      { label: "LinkedIn", url: "https://www.linkedin.com/in/your-username" },
      { label: "Twitter", url: "https://x.com/your-username" }
    ],
    location: "City, Country",
  },
  education: [
    {
      level: "Class 10",
      institution: "Your School Name",
      board: "CBSE/ICSE/State Board",
      year: "YYYY",
      scoreLabel: "Percentage",
      scoreValue: "XX%",
    },
    {
      level: "Class 12",
      institution: "Your School Name",
      board: "CBSE/ICSE/State Board",
      year: "YYYY",
      scoreLabel: "Percentage",
      scoreValue: "XX%",
    },
    {
      level: "College",
      institution: "Your College Name",
      board: "University / Program",
      year: "YYYY — YYYY",
      scoreLabel: "CGPA",
      scoreValue: "X.Y/10",
    },
  ],
  projects: [
    {
      title: "Project One",
      description:
        "Short sentence that explains the problem you solved and your impact.",
      tech: ["HTML", "CSS", "JavaScript"],
      links: {
        demo: "https://your-demo-url.example.com",
        code: "https://github.com/your-username/project-one",
      },
    },
    {
      title: "Project Two",
      description:
        "Another impactful project. Mention the result or measurable outcome.",
      tech: ["Node.js", "Express", "MongoDB"],
      links: {
        demo: "#",
        code: "https://github.com/your-username/project-two",
      },
    },
  ],
  experience: [
    {
      role: "Software Engineering Intern",
      company: "Company Name",
      period: "Jun 2024 — Aug 2024",
      location: "Remote / City",
      details:
        "Worked on feature X, collaborating with Y to deliver Z. Improved performance/stability by N%.",
      highlights: [
        "Implemented ABC with DEF, reducing load time by 35%",
        "Designed REST API endpoints and wrote unit tests",
      ],
    },
  ],
  contact: {
    email: "you@example.com",
    phone: "+91 99999 99999",
    location: "City, Country",
    resumeUrl: "assets/resume.pdf",
  },
};

function select(selector, root = document) {
  return root.querySelector(selector);
}

function create(element, className, text) {
  const el = document.createElement(element);
  if (className) el.className = className;
  if (text) el.textContent = text;
  return el;
}

function renderHeader() {
  const { name, role, summary, socials } = portfolioData.profile;
  select('#profileName').textContent = name;
  select('#profileRole').textContent = role;
  select('#profileSummary').textContent = summary;
  const socialWrap = select('#socialLinks');
  socialWrap.innerHTML = '';
  socials.forEach(s => {
    const a = create('a');
    a.href = s.url; a.target = '_blank'; a.rel = 'noopener noreferrer';
    a.textContent = s.label;
    socialWrap.appendChild(a);
  });
  select('#footerYear').textContent = new Date().getFullYear();
}

function renderEducation() {
  const wrap = select('#educationList');
  wrap.innerHTML = '';
  portfolioData.education.forEach(ed => {
    const card = create('div', 'card edu-card');
    const title = create('h3'); title.textContent = `${ed.level} — ${ed.institution}`;
    const meta = create('div', 'meta'); meta.textContent = `${ed.board} • ${ed.year}`;
    const score = create('p', 'score'); score.innerHTML = `${ed.scoreLabel}: <span class="score">${ed.scoreValue}</span>`;
    card.appendChild(title); card.appendChild(meta); card.appendChild(score);
    wrap.appendChild(card);
  });
}

function renderProjects() {
  const wrap = select('#projectsList');
  wrap.innerHTML = '';
  portfolioData.projects.forEach(p => {
    const card = create('div', 'card project-card');
    const title = create('h3'); title.textContent = p.title;
    const desc = create('p'); desc.textContent = p.description;
    const tags = create('div', 'tags');
    p.tech.forEach(t => tags.appendChild(create('span', 'tag', t)));
    const links = create('div', 'project-links');
    const demo = create('a'); demo.href = p.links.demo || '#'; demo.target = '_blank'; demo.rel = 'noopener'; demo.textContent = 'Live Demo';
    const code = create('a'); code.href = p.links.code || '#'; code.target = '_blank'; code.rel = 'noopener'; code.textContent = 'Source Code';
    links.appendChild(demo); links.appendChild(code);
    card.appendChild(title); card.appendChild(desc); card.appendChild(tags); card.appendChild(links);
    wrap.appendChild(card);
  });
}

function renderExperience() {
  const wrap = select('#experienceTimeline');
  wrap.innerHTML = '';
  portfolioData.experience.forEach(exp => {
    const item = create('div', 'timeline-item');
    const dot = create('div', 'dot');
    const content = create('div', 'content');
    const title = create('h3'); title.textContent = `${exp.role} — ${exp.company}`;
    const period = create('div', 'period'); period.textContent = `${exp.period} • ${exp.location}`;
    const details = create('p'); details.textContent = exp.details;
    const ul = create('ul');
    (exp.highlights || []).forEach(h => {
      const li = create('li'); li.textContent = h; ul.appendChild(li);
    });
    content.appendChild(title); content.appendChild(period); content.appendChild(details); content.appendChild(ul);
    item.appendChild(dot); item.appendChild(content);
    wrap.appendChild(item);
  });
}

function renderContact() {
  const wrap = select('#contactDetails');
  wrap.innerHTML = '';
  const entries = [
    { label: 'Email', value: portfolioData.contact.email, href: `mailto:${portfolioData.contact.email}` },
    { label: 'Phone', value: portfolioData.contact.phone, href: `tel:${portfolioData.contact.phone.replace(/\s+/g, '')}` },
    { label: 'Location', value: portfolioData.contact.location, href: null },
  ];
  entries.forEach(e => {
    const card = create('div', 'card contact-card');
    const title = create('h3'); title.textContent = e.label;
    const val = e.href ? create('a') : create('p');
    if (e.href) { val.href = e.href; val.textContent = e.value; }
    else { val.textContent = e.value; }
    card.appendChild(title); card.appendChild(val);
    wrap.appendChild(card);
  });
  // resume & email button
  const emailMe = select('#emailMe');
  const subject = encodeURIComponent('Hello from your portfolio');
  emailMe.href = `mailto:${portfolioData.contact.email}?subject=${subject}`;
}

function setupTheme() {
  const root = document.documentElement;
  const saved = localStorage.getItem('theme');
  if (saved === 'dark' || saved === 'light') {
    root.setAttribute('data-theme', saved);
  }
  const btn = select('#themeToggle');
  function updateIcon() {
    btn.textContent = root.getAttribute('data-theme') === 'dark' ? '☀️' : '🌙';
  }
  updateIcon();
  btn.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateIcon();
  });
}

function setupNav() {
  const toggle = select('#navToggle');
  const menu = select('#navMenu');
  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  menu.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', () => {
      menu.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const id = this.getAttribute('href');
      if (!id || id === '#' || !document.querySelector(id)) return;
      e.preventDefault();
      document.querySelector(id).scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', id);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderHeader();
  renderEducation();
  renderProjects();
  renderExperience();
  renderContact();
  setupTheme();
  setupNav();
  setupSmoothScroll();
});

