import Clock from './components/Clock'

const projects = [
  { name: 'Verbalist', url: 'https://github.com/filippodanesi/verbalist' },
  { name: 'VisionDescribe', url: 'https://github.com/filippodanesi/visiondescribe' },
  { name: 'NLU Analyzer', url: 'https://github.com/filippodanesi/nlu-analyzer' },
  { name: 'Web Content Scraper', url: 'https://github.com/filippodanesi/web-content-scraper' },
  { name: 'Open Source', url: 'https://github.com/filippodanesi' },
]

export default function Home() {
  return (
    <>
      <section className="hero">
        <h1>I'm an SEO & Content Marketing Specialist with 6+ years of experience. I combine data, AI, and content to drive search growth, merging traditional SEO with generative AI and LLMs.</h1>
      </section>

      <Clock />

      <section className="currently">
        <p className="currently-label">Currently</p>
        <ul className="currently-list">
          <li className="currently-content">
            SEO & AI Search Strategist (AEO/GEO) at <a href="https://en.wikipedia.org/wiki/Triumph_International" target="_blank" rel="noopener">Triumph International</a>
          </li>
          <li className="currently-content">
            Ambassador <a href="https://www.semrush.com" target="_blank" rel="noopener">@Semrush</a>
          </li>
        </ul>
      </section>

      <section className="projects">
        <h2>Projects</h2>
        <div className="project-list">
          {projects.map((project) => (
            <a key={project.name} href={project.url} className="project-item" target="_blank" rel="noopener">
              <span className="project-name">{project.name}</span>
              <span className="project-arrow">→</span>
            </a>
          ))}
        </div>
      </section>
    </>
  )
}
