import { useMemo, useState } from 'react'
import { ChevronDown, ExternalLink, Linkedin, Mail, MapPin, Phone } from 'lucide-react'

type Project = {
  id: string
  title: string
  category: string
  description: string
  details: string[]
  tools: string[]
}

type Experience = {
  role: string
  organization: string
  period: string
  highlights: string[]
}

const EMAIL = 'ikhandelwal168@gmail.com'
const LINKEDIN_URL = 'https://www.linkedin.com/in/isha-khandelwal-a01243254'
const PHONE_DISPLAY = '+91 70735 88865'
const PHONE_TEL = '+917073588865'
const LOCATION_DISPLAY = 'Mumbai, India'

export default function App() {
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null)

  const projects = useMemo<Project[]>(
    () => [
      {
        id: 'hypen-seo',
        title: 'SEO Optimization - HYPHEN',
        category: 'Digital Marketing',
        description: 'Led comprehensive SEO audit for a clean beauty brand using industry-standard tools.',
        details: [
          'Conducted in-depth SEO audit using SEMrush, Ahrefs, and SEOptimer',
          'Performed keyword research and competitive analysis',
          'Optimized meta tags and proposed off-page strategies',
          'Gained practical insights into technical SEO implementation',
        ],
        tools: ['SEMrush', 'Ahrefs', 'SEOptimer'],
      },
      {
        id: 'salon-soiree',
        title: 'Salon Soirée - Business Venture',
        category: 'Business Strategy',
        description:
          'Designed a premium salon booking platform with focus on financial planning and market positioning.',
        details: [
          'Collaborated with CFO on financial planning and cost strategy',
          'Developed competitive positioning framework',
          'Participated in simulated boardroom competition',
          'Applied management concepts to real-world business scenario',
        ],
        tools: ['Business Planning', 'Financial Analysis', 'Market Research'],
      },
      {
        id: 'govardhan-sustainability',
        title: 'Sustainability Analysis - Govardhan Eco Village',
        category: 'Sustainability Research',
        description: "Analyzed ISKCON's eco-village sustainability model and its scalability potential.",
        details: [
          'Studied innovative systems like plastic pyrolysis',
          'Analyzed zero-waste farming practices',
          'Evaluated economic and environmental impact',
          'Assessed scalability of sustainable practices',
        ],
        tools: ['Research', 'Data Analysis', 'Sustainability Metrics'],
      },
    ],
    [],
  )

  const experiences = useMemo<Experience[]>(
    () => [
      {
        role: 'Marketing Department - Organising Committee',
        organization: 'Entrepreneurship Cell, Jai Hind College',
        period: '2024 - 2025',
        highlights: [
          'Managed stall collaborations and sponsor partnerships',
          'Curated event flow and hosted events',
          'Enhanced public speaking and stakeholder management skills',
        ],
      },
      {
        role: 'Marketing & Events - Organising Committee',
        organization: 'Jai Hind Digital Nexus',
        period: '2024 - 2025',
        highlights: [
          'Curated events and prepared marketing content',
          'Coordinated cross-functional marketing efforts',
          'Gained hands-on event planning and promotion experience',
        ],
      },
      {
        role: 'Secretary & Vice-Captain',
        organization: 'Modern School, Kota',
        period: 'Class 11 & 12',
        highlights: [
          'Oversaw Annual Fest and Art Fest execution',
          'Managed performances and coordinated schedules',
          "Led one of the school's largest cultural events",
        ],
      },
    ],
    [],
  )

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-blue-50 text-slate-800">
      {/* HERO */}
      <section className="min-h-screen flex flex-col justify-center items-center px-4 py-20 relative">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Isha Khandelwal
          </h1>

          <p className="text-2xl md:text-3xl font-semibold text-purple-600 mb-6">
            Digital Strategist & Marketing Enthusiast
          </p>

          <p className="text-lg md:text-xl text-slate-700 mb-8 max-w-2xl mx-auto">
            Second-year Digital Strategy student passionate about creating meaningful brand experiences through
            data-driven marketing, strategic events, and creative storytelling.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
            <a
              href={`mailto:${EMAIL}`}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300 inline-flex items-center gap-2"
            >
              <Mail size={20} />
              Get in Touch
            </a>

            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-white text-purple-600 border-2 border-purple-600 rounded-full font-semibold hover:bg-purple-50 hover:scale-105 transition-all duration-300 inline-flex items-center gap-2"
            >
              <Linkedin size={20} />
              LinkedIn
              <ExternalLink size={16} />
            </a>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-slate-700 mb-12">
            <div className="flex items-center gap-2">
              <MapPin size={20} className="text-purple-600" />
              <span className="font-medium">{LOCATION_DISPLAY}</span>
            </div>

            <a
              href={`tel:${PHONE_TEL}`}
              className="flex items-center gap-2 hover:text-purple-700 transition-colors"
              aria-label={`Call ${PHONE_DISPLAY}`}
            >
              <Phone size={20} className="text-purple-600" />
              <span className="font-medium">{PHONE_DISPLAY}</span>
            </a>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <button
              onClick={() => scrollToSection('about')}
              className="text-purple-600 hover:text-purple-700 transition-colors"
              aria-label="Scroll to About section"
            >
              <ChevronDown size={32} />
            </button>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            About Me
          </h2>
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 text-slate-700 text-lg leading-relaxed">
            <p>
              I'm a second-year Bachelor's student in Digital Strategy at Jai Hind College, Mumbai, where I'm turning
              my passion for marketing and branding into real-world expertise. My journey is driven by curiosity about
              consumer behavior and a love for creating experiences that connect brands with people.
            </p>
            <p className="mt-6">
              From managing collaborations for college entrepreneurship events to leading school cultural festivals, I've
              learned that great marketing is about understanding people, telling compelling stories, and executing with
              precision. Whether it's optimizing SEO strategies, curating events, or designing business ventures, I
              thrive on the creative and analytical challenges that digital marketing brings.
            </p>
            <p className="mt-6">
              I'm actively seeking internship opportunities where I can apply my skills in both online and offline
              marketing, contribute fresh ideas, and learn from experienced professionals in dynamic business
              environments.
            </p>
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Skills
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <h3 className="text-2xl font-bold text-purple-600 mb-6">Technical Skills</h3>
              <div className="flex flex-wrap gap-3">
                {[
                  'SEMrush',
                  'Canva',
                  'WordPress',
                  'SEO',
                  'Social Media Marketing',
                  'Content Creation',
                  'Microsoft Excel',
                  'Google Sheets',
                ].map((skill) => (
                  <span
                    key={skill}
                    className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full font-medium hover:bg-purple-200 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <h3 className="text-2xl font-bold text-blue-600 mb-6">Soft Skills</h3>
              <div className="flex flex-wrap gap-3">
                {[
                  'Communication',
                  'Teamwork',
                  'Leadership',
                  'Event Curation',
                  'Public Speaking',
                  'Project Coordination',
                  'Creativity',
                  'Time Management',
                ].map((skill) => (
                  <span
                    key={skill}
                    className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-medium hover:bg-blue-200 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Featured Projects
          </h2>

          <div className="space-y-6">
            {projects.map((project) => {
              const expanded = expandedProjectId === project.id
              return (
                <div
                  key={project.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setExpandedProjectId(expanded ? null : project.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') setExpandedProjectId(expanded ? null : project.id)
                  }}
                  className={`bg-white rounded-2xl shadow-lg p-6 md:p-8 cursor-pointer transition-all duration-300 hover:shadow-xl ${
                    expanded ? 'ring-2 ring-purple-500' : 'ring-0'
                  }`}
                  aria-expanded={expanded}
                >
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex-1">
                      <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-3">
                        {project.category}
                      </span>
                      <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">{project.title}</h3>
                      <p className="text-slate-600 text-lg">{project.description}</p>
                    </div>
                    <ChevronDown
                      size={24}
                      className={`text-purple-600 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
                    />
                  </div>

                  {expanded && (
                    <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
                      <div>
                        <h4 className="font-bold text-slate-900 mb-3">Key Activities:</h4>
                        <ul className="list-disc list-inside space-y-2 text-slate-700">
                          {project.details.map((detail, idx) => (
                            <li key={`${project.id}-d-${idx}`}>{detail}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 mb-3">Tools Used:</h4>
                        <div className="flex flex-wrap gap-2">
                          {project.tools.map((tool) => (
                            <span
                              key={tool}
                              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                            >
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Leadership & Experience
          </h2>

          <div className="space-y-6">
            {experiences.map((exp) => (
              <div
                key={exp.role + exp.organization}
                className="bg-white rounded-2xl shadow-lg p-6 md:p-8 hover:shadow-xl transition-shadow duration-300"
              >
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">{exp.role}</h3>
                <p className="text-lg text-purple-600 font-semibold mb-1">{exp.organization}</p>
                <p className="text-slate-500">{exp.period}</p>

                <ul className="list-disc list-inside space-y-2 text-slate-700 mt-4">
                  {exp.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EDUCATION */}
      <section id="education" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Education
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-lg p-8 text-white hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-2xl font-bold mb-2">Bachelor's in Digital Strategy</h3>
              <p className="text-lg opacity-90 mb-1">Jai Hind College, Mumbai</p>
              <p className="text-base opacity-75">2024 - 2027</p>
            </div>

            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-lg p-8 text-white hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-2xl font-bold mb-2">CBSE Higher Secondary Certificate</h3>
              <p className="text-lg opacity-90 mb-1">Modern School, Kota</p>
              <p className="text-base opacity-75">Commerce Stream · 2024</p>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-lg p-12 text-center text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Let's Connect!</h2>
            <p className="text-xl opacity-90 mb-8">
              I'm always excited to discuss marketing strategies, collaboration opportunities, or potential internships.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`mailto:${EMAIL}`}
                className="px-8 py-3 bg-white text-purple-600 rounded-full font-semibold hover:bg-purple-50 hover:scale-105 transition-all duration-300 inline-flex items-center gap-2 justify-center"
              >
                <Mail size={20} />
                Email Me
              </a>

              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-purple-600 hover:scale-105 transition-all duration-300 inline-flex items-center gap-2 justify-center"
              >
                <Linkedin size={20} />
                LinkedIn
                <ExternalLink size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 px-4 text-center text-slate-600">
        <p>© 2024 Isha Khandelwal. Designed with passion for digital strategy.</p>
      </footer>
    </div>
  )
}
