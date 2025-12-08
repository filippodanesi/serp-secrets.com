import type { Metadata } from 'next'
import { Download } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about Filippo Danesi - SEO and Content Marketing Specialist with 6+ years of experience in Technical SEO, AI integration, and content optimization.',
  alternates: {
    canonical: 'https://www.filippodanesi.com/about',
  },
  openGraph: {
    title: 'About ~ Filippo Danesi',
    description: 'Learn about Filippo Danesi - SEO and Content Marketing Specialist with 6+ years of experience.',
    url: 'https://www.filippodanesi.com/about',
  },
}

const experiences = [
  {
    role: 'SEO Content & AI Automation Manager',
    company: 'Triumph International',
    location: 'Zurich, Switzerland',
    date: 'May 2025 — Present',
    description: 'Leading AEO/GEO strategy across 15+ markets, building AI workflows that cut content production by 70%.',
  },
  {
    role: 'SEO Specialist (Innovation Lead)',
    company: 'NUR Digital Marketing Agency',
    location: 'Mantua, Italy',
    date: 'Sep 2022 — Apr 2025',
    description: 'Led AI-SEO innovation and mentored the tech team, driving 35% organic traffic growth in 6 months.',
  },
  {
    role: 'SEO Specialist',
    company: 'TeseCom Agency',
    location: 'Pisa, Italy',
    date: 'Sep 2020 — Sep 2022',
    description: 'Managed SEO and SEM campaigns with a multichannel strategy approach for diverse clients.',
  },
  {
    role: 'SEO Specialist',
    company: 'Brand-On Agency',
    location: 'Pisa, Italy',
    date: 'May 2019 — Sep 2020',
    description: 'Specialized in e-commerce growth, optimizing online stores for organic visibility and conversions.',
  },
]

const skills = [
  'Generative AI',
  'Prompt Engineering',
  'LLM Optimization',
  'RAG',
  'Python',
  'AEO',
  'GEO',
  'Technical SEO',
  'AI Automation',
  'SEO',
  'NLP/NLU',
]

const contacts = [
  { label: 'Email', value: 'hello@filippodanesi.com', href: 'mailto:hello@filippodanesi.com' },
  { label: 'LinkedIn', value: 'filippodanesi', href: 'https://linkedin.com/in/filippodanesi' },
  { label: 'GitHub', value: 'filippodanesi', href: 'https://github.com/filippodanesi' },
  { label: 'Location', value: 'Zurich, CH', href: null },
]

export default function About() {
  return (
    <>
      <h1 className="page-title">About</h1>

      <section className="section">
        <h2 className="section-title">Bio</h2>
        <div className="section-content">
          <p>SEO & GEO Manager with 6+ years of experience in strategic optimization for global brands across international markets. Merging traditional SEO with generative AI and LLMs to engineer Answer Engine Optimization (AEO), Generative Engine Optimization (GEO), and content intelligence solutions.</p>
          <p>Scaling marketing efforts through automation, reducing operational costs by 99%+ while enhancing search intent alignment and e-commerce performance.</p>
        </div>
        <a href="/Filippo_Danesi_Resume.pdf" target="_blank" className="cv-button">
          <Download size={16} />
          Download CV
        </a>
      </section>

      <section className="section">
        <h2 className="section-title">Experience</h2>
        {experiences.map((exp, index) => (
          <div key={index} className="experience-item">
            <div className="experience-header">
              <span className="experience-role">{exp.role}</span>
              <span className="experience-date">{exp.date}</span>
            </div>
            <div className="experience-company">{exp.company} · {exp.location}</div>
            <p className="experience-description">{exp.description}</p>
          </div>
        ))}
      </section>

      <section className="section">
        <h2 className="section-title">Skills</h2>
        <div className="skills-list">
          {skills.map((skill) => (
            <span key={skill} className="skill-tag">{skill}</span>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Contact</h2>
        {contacts.map((contact) => (
          <div key={contact.label} className="contact-item">
            <span className="contact-label">{contact.label}</span>
            {contact.href ? (
              <a href={contact.href} target={contact.href.startsWith('mailto') ? undefined : '_blank'} className="contact-value">
                {contact.value}
              </a>
            ) : (
              <span className="contact-value">{contact.value}</span>
            )}
          </div>
        ))}
      </section>
    </>
  )
}
