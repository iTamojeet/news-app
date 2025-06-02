import React from 'react'
import { FiX } from 'react-icons/fi'
import './NewsModal.css'

const NewsModal = ({ show, article, onClose }) => {
  if (!show) {
    return null
  }
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          <FiX size={24} />
        </button>
        {article && (
          <>
            <img src={article.image} alt={article.title} className="modal-image" />
            <h2 className="modal-title">{article.title}</h2>
            <p className="modal-source">Source: {article.source.name}</p>
            <p className="modal-date">
              {new Date(article.publishedAt).toLocaleString('en-US', {
                month: 'short',
                day: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
            <p className="modal-content-text">{article.content}</p>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="read-more-link"
            >
              Read More
            </a>
          </>
        )}
      </div>
    </div>
  )
}

export default NewsModal
