'use client'

import { useState } from 'react'
import { LIBRARY, LEVEL_COLORS, LEVEL_LABELS, type StaticLesson, type IndustryCategory } from '../lib/libraryData'
import Link from 'next/link'
import './styles/library.css'

const ALL_LEVELS = ['All', 'A2', 'B1', 'B2', 'C1']
const ALL_DURATIONS = ['All', 'Under 70 min', '70–90 min', '90+ min']

function filterLessons(
  lessons: StaticLesson[],
  level: string,
  duration: string,
  search: string
): StaticLesson[] {
  return lessons.filter((l) => {
    if (level !== 'All' && l.level !== level) return false
    if (duration === 'Under 70 min' && l.duration >= 70) return false
    if (duration === '70–90 min' && (l.duration < 70 || l.duration > 90)) return false
    if (duration === '90+ min' && l.duration < 90) return false
    if (search) {
      const q = search.toLowerCase()
      return (
        l.title.toLowerCase().includes(q) ||
        l.tags.some((t) => t.toLowerCase().includes(q)) ||
        l.targetRole.toLowerCase().includes(q) ||
        l.topic.toLowerCase().includes(q)
      )
    }
    return true
  })
}

function LessonCard({ lesson }: { lesson: StaticLesson }) {
  return (
    <div className="lib-lesson-card">
      <div className="lib-lesson-card-header">
        <div className="lib-lesson-meta">
          <span className="lib-badge" style={{ background: LEVEL_COLORS[lesson.level] + '20', color: LEVEL_COLORS[lesson.level], border: `1px solid ${LEVEL_COLORS[lesson.level]}35` }}>
            {lesson.level} — {LEVEL_LABELS[lesson.level]}
          </span>
          <span className="lib-badge-neutral">{lesson.duration} min</span>
        </div>
        <h3 className="lib-lesson-title">{lesson.title}</h3>
        <p className="lib-lesson-subtitle">{lesson.subtitle}</p>
      </div>

      <div className="lib-lesson-body">
        <div className="lib-lesson-detail">
          <span className="lib-detail-label">Target Role</span>
          <span className="lib-detail-value">{lesson.targetRole}</span>
        </div>
        <div className="lib-lesson-detail">
          <span className="lib-detail-label">Grammar Focus</span>
          <span className="lib-detail-value">{lesson.grammarFocus}</span>
        </div>
        <p className="lib-lesson-description">{lesson.description}</p>
      </div>

      <div className="lib-lesson-tags">
        {lesson.tags.map((tag) => (
          <span key={tag} className="lib-tag">{tag}</span>
        ))}
      </div>

      <div className="lib-lesson-actions">
        <button className="lib-btn-primary" id={`launch-${lesson.id}`}
          onClick={() => {
            localStorage.setItem('ts_static_lesson_id', lesson.id)
            alert(`🔧 Full content for "${lesson.title}" coming soon.\n\nIn the next update, clicking this will open the complete lesson in Teach Mode.`)
          }}>
          ▶ Open Lesson
        </button>
        <Link href={`/lesson-forge?prefill=${encodeURIComponent(lesson.topic)}`} className="lib-btn-secondary">
          ✏ Personalize It
        </Link>
      </div>
    </div>
  )
}

function IndustrySection({ category, levelFilter, durationFilter, search }: {
  category: IndustryCategory
  levelFilter: string
  durationFilter: string
  search: string
}) {
  const [expanded, setExpanded] = useState(false)
  const filtered = filterLessons(category.lessons, levelFilter, durationFilter, search)
  const displayed = expanded ? filtered : filtered.slice(0, 3)

  if (filtered.length === 0 && (levelFilter !== 'All' || durationFilter !== 'All' || search)) return null

  return (
    <section className="lib-industry-section" id={`industry-${category.id}`}>
      <div className="lib-industry-header">
        <div className="lib-industry-icon" style={{ background: category.color + '18', border: `1px solid ${category.color}30` }}>
          {category.emoji}
        </div>
        <div className="lib-industry-info">
          <h2 className="lib-industry-name">{category.name}</h2>
          <p className="lib-industry-desc">{category.description}</p>
        </div>
        <div className="lib-industry-count" style={{ color: category.color }}>
          <span className="lib-count-number">{category.lessonsCount}</span>
          <span className="lib-count-label">Lessons</span>
        </div>
      </div>

      {filtered.length > 0 ? (
        <>
          <div className="lib-lessons-grid">
            {displayed.map((lesson) => (
              <LessonCard key={lesson.id} lesson={lesson} />
            ))}
          </div>
          {filtered.length > 3 && (
            <div className="lib-show-more">
              <button className="lib-show-more-btn" onClick={() => setExpanded(!expanded)}>
                {expanded ? `↑ Show fewer lessons` : `↓ Show all ${filtered.length} lessons in ${category.name}`}
              </button>
            </div>
          )}
        </>
      ) : (
        <p style={{ color: '#475569', fontSize: 13, padding: '16px 0' }}>No lessons match your current filters in this industry.</p>
      )}
    </section>
  )
}

export default function LibraryPage() {
  const [levelFilter, setLevelFilter] = useState('All')
  const [durationFilter, setDurationFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [activeIndustry, setActiveIndustry] = useState<string | null>(null)

  const totalLessons = LIBRARY.reduce((acc, cat) => acc + cat.lessonsCount, 0)
  const visibleCategories = activeIndustry
    ? LIBRARY.filter((c) => c.id === activeIndustry)
    : LIBRARY

  return (
    <div className="lib-root">
      {/* Hero */}
      <div className="lib-hero">
        <div className="lib-hero-badge">📚 Talksmiths Lesson Library</div>
        <h1>Ready-Made Lessons.<br />Any Industry. Any Role.</h1>
        <p>
          <span className="lib-hero-stat">{totalLessons}+</span> expert-crafted lessons following the IDEA Methodology™.
          Industry-organised, CEFR-calibrated, ready to teach.
        </p>
      </div>

      {/* Industry Quick Nav */}
      <div className="lib-industry-nav">
        <button
          className={`lib-nav-chip ${activeIndustry === null ? 'active' : ''}`}
          onClick={() => setActiveIndustry(null)}
        >
          All Industries
        </button>
        {LIBRARY.map((cat) => (
          <button
            key={cat.id}
            className={`lib-nav-chip ${activeIndustry === cat.id ? 'active' : ''}`}
            style={{ borderColor: activeIndustry === cat.id ? cat.color : undefined, color: activeIndustry === cat.id ? cat.color : undefined }}
            onClick={() => setActiveIndustry(activeIndustry === cat.id ? null : cat.id)}
          >
            {cat.emoji} {cat.name}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="lib-filters">
        <div className="lib-search-wrapper">
          <span className="lib-search-icon">🔍</span>
          <input
            id="lib-search-input"
            className="lib-search-input"
            type="text"
            placeholder="Search by topic, role, or tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="lib-search-clear" onClick={() => setSearch('')}>✕</button>
          )}
        </div>

        <div className="lib-filter-group">
          <span className="lib-filter-label">Level:</span>
          {ALL_LEVELS.map((l) => (
            <button
              key={l}
              className={`lib-filter-chip ${levelFilter === l ? 'active' : ''}`}
              style={levelFilter === l && l !== 'All' ? { background: LEVEL_COLORS[l] + '20', color: LEVEL_COLORS[l], borderColor: LEVEL_COLORS[l] + '50' } : {}}
              onClick={() => setLevelFilter(l)}
            >
              {l}
            </button>
          ))}
        </div>

        <div className="lib-filter-group">
          <span className="lib-filter-label">Duration:</span>
          {ALL_DURATIONS.map((d) => (
            <button
              key={d}
              className={`lib-filter-chip ${durationFilter === d ? 'active' : ''}`}
              onClick={() => setDurationFilter(d)}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="lib-content">
        {visibleCategories.map((cat) => (
          <IndustrySection
            key={cat.id}
            category={cat}
            levelFilter={levelFilter}
            durationFilter={durationFilter}
            search={search}
          />
        ))}

        {/* Create Custom CTA */}
        <div className="lib-cta-card">
          <div className="lib-cta-emoji">⚡</div>
          <h2 className="lib-cta-title">Don't see your exact situation?</h2>
          <p className="lib-cta-desc">
            Use the Lesson Forge to generate a 100% personalised lesson on any topic—calibrated to your industry, job title, and CEFR level in seconds.
          </p>
          <Link href="/lesson-forge" className="lib-cta-btn">
            Open Lesson Forge →
          </Link>
        </div>
      </div>
    </div>
  )
}
