import { useEffect, useState } from 'react'
import SafeImage from './SafeImage'

const CAREER_VIDEO_CATEGORIES = new Set(['career', 'interview', 'career_story'])
const PLAY_VIDEO_LIMIT = 5

function getYouTubeEmbedUrl(url) {
  if (!url) return ''

  try {
    const parsedUrl = new URL(url)
    const hostname = parsedUrl.hostname.replace('www.', '')

    if (hostname === 'youtu.be') {
      const videoId = parsedUrl.pathname.split('/').filter(Boolean)[0]
      return videoId ? `https://www.youtube-nocookie.com/embed/${videoId}` : ''
    }

    if (hostname.includes('youtube.com')) {
      if (parsedUrl.pathname.startsWith('/embed/')) {
        return url
      }

      if (parsedUrl.pathname.startsWith('/shorts/')) {
        const videoId = parsedUrl.pathname.split('/').filter(Boolean)[1]
        return videoId ? `https://www.youtube-nocookie.com/embed/${videoId}` : ''
      }

      const videoId = parsedUrl.searchParams.get('v')
      return videoId ? `https://www.youtube-nocookie.com/embed/${videoId}` : ''
    }
  } catch (_error) {
    return ''
  }

  return ''
}

function getFootageSearch(playerName) {
  const query = encodeURIComponent(`${playerName || 'basketball player'} career highlights best plays`)
  return {
    url: `https://www.youtube.com/results?search_query=${query}`,
  }
}

function normalizeMedia(player) {
  const media = []
  const playVideos = []
  let careerVideo = null

  if (player?.image) {
    media.push({
      type: 'image',
      src: player.image,
      title: `${player.names} portrait`,
    })
  }

  ;(player?.media || []).forEach((item, index) => {
    const src = item.src || item.url || item.embedUrl
    if (!src) return

    const youtubeEmbedUrl = getYouTubeEmbedUrl(src)
    const mediaType = item.type || (youtubeEmbedUrl || src.includes('youtube') || src.includes('youtu.be') ? 'video' : 'image')
    const category = item.category || 'play'
    const slide = {
      type: mediaType,
      category,
      src,
      embedUrl: item.embedUrl || youtubeEmbedUrl,
      poster: item.poster,
      title: item.title || `${player.names} media ${index + 1}`,
      caption: item.caption || '',
      url: item.url || src,
    }

    if (mediaType === 'video' && CAREER_VIDEO_CATEGORIES.has(category)) {
      careerVideo = careerVideo || {
        ...slide,
        title: item.title || `${player.names} career story`,
        caption: item.caption || 'Career interview and reflections',
      }
      return
    }

    if (mediaType === 'video') {
      if (playVideos.length < PLAY_VIDEO_LIMIT) {
        playVideos.push(slide)
      }
      return
    }

    media.push(slide)
  })

  media.push(...playVideos)

  if (careerVideo) {
    media.push(careerVideo)
  }

  const hasFootage = media.some((item) => item.type === 'video' || item.type === 'footage')
  if (!hasFootage) {
    const footage = getFootageSearch(player?.names)
    media.push({
      type: 'footage',
      url: footage.url,
      src: player?.image,
      title: `${player?.names || 'Player'} footage`,
      caption: 'Career highlights and in-game plays',
    })
  }

  return media
}

function PlayerMediaCarousel({ player }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const slides = normalizeMedia(player)
  const activeSlide = slides[activeIndex] || slides[0]

  useEffect(() => {
    setActiveIndex(0)
  }, [player?.id])

  if (!activeSlide) {
    return <SafeImage src={player?.image} alt={player?.names} fallbackLabel={player?.names} />
  }

  function showPrevious() {
    setActiveIndex((currentIndex) => (currentIndex === 0 ? slides.length - 1 : currentIndex - 1))
  }

  function showNext() {
    setActiveIndex((currentIndex) => (currentIndex === slides.length - 1 ? 0 : currentIndex + 1))
  }

  return (
    <div className="media-carousel" aria-label={`${player.names} media carousel`}>
      <div className="media-carousel__stage">
        {activeSlide.type === 'image' && (
          <SafeImage src={activeSlide.src} alt={activeSlide.title} fallbackLabel={player.names} />
        )}

        {(activeSlide.type === 'video' || activeSlide.type === 'footage') && activeSlide.embedUrl && (
          <iframe
            src={activeSlide.embedUrl}
            title={activeSlide.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}

        {activeSlide.type === 'video' && !activeSlide.embedUrl && (
          <video controls poster={activeSlide.poster || player.image} src={activeSlide.src}>
            <a href={activeSlide.src}>Watch {activeSlide.title}</a>
          </video>
        )}

        {activeSlide.type === 'footage' && !activeSlide.embedUrl && (
          <div className="media-carousel__fallback">
            <SafeImage src={activeSlide.src} alt={activeSlide.title} fallbackLabel={player.names} />
            {activeSlide.url && (
              <a className="media-carousel__external" href={activeSlide.url} target="_blank" rel="noreferrer">
                Open footage
              </a>
            )}
          </div>
        )}
      </div>

      <div className="media-carousel__meta">
        <div>
          <strong>{activeSlide.title}</strong>
          {activeSlide.caption && <span>{activeSlide.caption}</span>}
        </div>
        <span>{activeIndex + 1} / {slides.length}</span>
      </div>

      {slides.length > 1 && (
        <div className="media-carousel__controls">
          <button type="button" onClick={showPrevious}>Prev</button>
          <div className="media-carousel__dots" aria-label="Choose media slide">
            {slides.map((slide, index) => (
              <button
                key={`${slide.title}-${index}`}
                type="button"
                className={index === activeIndex ? 'is-active' : ''}
                aria-label={`Show ${slide.title}`}
                aria-pressed={index === activeIndex}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div>
          <button type="button" onClick={showNext}>Next</button>
        </div>
      )}
    </div>
  )
}

export default PlayerMediaCarousel