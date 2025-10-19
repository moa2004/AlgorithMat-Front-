import React from 'react'
import "./Footer.css"

export default function Footer() {
  return (
     <footer className="simple-footer">
        <div className="footer-container">
            <h2 className="footer-title">AlgorithMat</h2>
            <p className="footer-paragraph">
              Problem solving is more than an interview exercise—it's the language of innovation.
              AlgorithMat helps you sharpen that language with challenges that teach resilience,
              pattern recognition, and clean thinking. Keep iterating, keep testing, and celebrate
              every accepted submission.
            </p>
            <div className="footer-links">
              <span className="footer-highlight">Built for curious engineers and lifelong learners.</span>
            </div>
        </div>
    </footer>
  )
}
