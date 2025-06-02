import React, { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { FiSearch, FiBookmark, FiShare2, FiClock } from 'react-icons/fi'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import techImg from '../assets/images/tech.jpg'
import wordlImg from '../assets/images/world.jpg'
import sportsImg from '../assets/images/sports.jpg'
import scienceImg from '../assets/images/science.jpg'
import healthImg from '../assets/images/health.jpg'
import entertainmentImg from '../assets/images/entertainment.jpg'
import nationImg from '../assets/images/nation.jpg'
import noImg from '../assets/images/no-img.png'
import './News.css'
import axios from 'axios'
import NewsModal from './NewsModal'

const categories = [
  { id: 'general', icon: '🌐', label: 'General' },
  { id: 'world', icon: '🌍', label: 'World' },
  { id: 'business', icon: '💼', label: 'Business' },
  { id: 'technology', icon: '💻', label: 'Technology' },
  { id: 'entertainment', icon: '🎬', label: 'Entertainment' },
  { id: 'sports', icon: '⚽', label: 'Sports' },
  { id: 'science', icon: '🔬', label: 'Science' },
  { id: 'health', icon: '🏥', label: 'Health' },
  { id: 'nation', icon: '🏛️', label: 'Nation' },
]

const News = () => {
  const [headline, setHeadline] = useState(null)
  const [news, setNews] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('general')
  const [showModal, setShowModal] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [bookmarkedArticles, setBookmarkedArticles] = useState([])

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true)
        const url = `https://gnews.io/api/v4/top-headlines?category=${selectedCategory}&lang=en&apikey=9c404c552f6102517c9c531e4d8475da`
        const response = await axios.get(url)

        const fetchedNews = response.data.articles

        fetchedNews.forEach((article) => {
          if (!article.image) {
            article.image = noImg
          }
        })

        setHeadline(fetchedNews[0])
        setNews(fetchedNews.slice(1, 7))
      } catch (error) {
        toast.error('Failed to fetch news. Please try again later.')
        console.error('Error fetching news:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [selectedCategory])

  const handleCategoryClick = (e, category) => {
    e.preventDefault()
    setSelectedCategory(category)
  }

  const handleArticleClick = (article) => {
    setSelectedArticle(article)
    setShowModal(true)
  }

  const handleBookmark = (article) => {
    const isBookmarked = bookmarkedArticles.some((a) => a.url === article.url)
    
    if (isBookmarked) {
      setBookmarkedArticles(bookmarkedArticles.filter((a) => a.url !== article.url))
      toast.info('Article removed from bookmarks')
    } else {
      setBookmarkedArticles([...bookmarkedArticles, article])
      toast.success('Article bookmarked successfully')
    }
  }

  const handleShare = async (article) => {
    try {
      await navigator.share({
        title: article.title,
        text: article.description,
        url: article.url,
      })
      toast.success('Article shared successfully')
    } catch (error) {
      toast.error('Failed to share article')
    }
  }

  const filteredNews = news.filter((article) =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="news-app">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="news-header">
        <h1 className="logo">News App</h1>
        <div className="search-container">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search news..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>
      <div className="news-content">
        <nav className="navbar">
          <h1 className="nav-heading">Categories</h1>
          <div className="categories">
            {categories.map((category) => (
              <a
                href="#"
                className={`nav-link ${selectedCategory === category.id ? 'active' : ''}`}
                key={category.id}
                onClick={(e) => handleCategoryClick(e, category.id)}
              >
                <span className="category-icon">{category.icon}</span>
                {category.label}
              </a>
            ))}
          </div>
        </nav>
        <div className="news-section">
          {loading ? (
            <Skeleton height={500} className="headline-skeleton" />
          ) : (
            headline && (
              <div className="headline" onClick={() => handleArticleClick(headline)}>
                <img src={headline.image || noImg} alt={headline.title} />
                <div className="headline-content">
                  <h2 className="headline-title">{headline.title}</h2>
                  <p className="headline-description">{headline.description}</p>
                  <div className="headline-meta">
                    <span className="headline-date">
                      {format(new Date(headline.publishedAt), 'MMM dd, yyyy')}
                    </span>
                    <div className="headline-actions">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleBookmark(headline)
                        }}
                        className="action-button"
                      >
                        <FiBookmark />
                        <span>Bookmark</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleShare(headline)
                        }}
                        className="action-button"
                      >
                        <FiShare2 />
                        <span>Share</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}

          <div className="news-grid">
            {loading
              ? Array(6)
                  .fill()
                  .map((_, index) => (
                    <Skeleton key={index} height={400} className="news-grid-skeleton" />
                  ))
              : filteredNews.map((article, index) => (
                  <div
                    className="news-grid-item"
                    key={index}
                    onClick={() => handleArticleClick(article)}
                  >
                    <img src={article.image || noImg} alt={article.title} />
                    <div className="news-grid-content">
                      <h3>{article.title}</h3>
                      <p className="news-date">
                        {format(new Date(article.publishedAt), 'MMM dd, yyyy')}
                      </p>
                      <div className="news-actions">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleBookmark(article)
                          }}
                          className="action-button"
                        >
                          <FiBookmark />
                          <span>Bookmark</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleShare(article)
                          }}
                          className="action-button"
                        >
                          <FiShare2 />
                          <span>Share</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        </div>
        <NewsModal show={showModal} article={selectedArticle} onClose={() => setShowModal(false)} />
      </div>
      <footer>
        <p className="copyright">
          <span>News App</span> &copy; {new Date().getFullYear()} All Rights Reserved
        </p>
      </footer>
    </div>
  )
}

export default News
