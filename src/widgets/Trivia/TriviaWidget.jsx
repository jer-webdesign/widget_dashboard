import { useEffect, useState, useRef } from 'react';
import { useRemoveWidget } from '../../RemoveWidgetContext';
import './TriviaWidget.css';
import CloseIcon from '@mui/icons-material/Close';

export default function TriviaWidget({ isActive, index, trivia, setTrivia, isInitialized, setIsInitialized, showAnswer, setShowAnswer }) {
  const [loading, setLoading] = useState(false);
  const [answerKey, setAnswerKey] = useState(0);
  const [hasTrivia, setHasTrivia] = useState(false);
  const removeWidget = useRemoveWidget(index);
  const currentTriviaRef = useRef(null);

  const fallbackQuestions = [
    {
      question: "What does API stand for in programming?",
      answer: "Application Programming Interface"
    },
    {
      question: "Which programming language is known as the 'language of the web'?",
      answer: "JavaScript"
    },
    {
      question: "What does HTML stand for?",
      answer: "HyperText Markup Language"
    },
    {
      question: "What is the main purpose of CSS?",
      answer: "To style and layout web pages"
    },
    {
      question: "What does JSON stand for?",
      answer: "JavaScript Object Notation"
    },
    {
      question: "What does DOM stand for in web development?",
      answer: "Document Object Model"
    },
    {
      question: "Which HTTP method is used to retrieve data from a server?",
      answer: "GET"
    },
    {
      question: "What does SQL stand for?",
      answer: "Structured Query Language"
    },
    {
      question: "What is the primary purpose of a compiler?",
      answer: "To translate source code into machine code"
    },
    {
      question: "What does MVC stand for in software architecture?",
      answer: "Model-View-Controller"
    }
  ];

  const fetchTrivia = async () => {
    setLoading(true);
    
    // If offline, use fallback questions immediately
    if (!navigator.onLine) {
      const randomQuestion = fallbackQuestions[Math.floor(Math.random() * fallbackQuestions.length)];
      setTrivia(randomQuestion);
      setAnswerKey(prev => prev + 1);
      setShowAnswer(false);
      setHasTrivia(true);
      setLoading(false);
      return;
    }
    
    try {
      const response = await fetch('https://opentdb.com/api.php?amount=1&category=18&type=multiple');
      
      // If rate limited or any error, use fallback questions immediately
      if (response.status === 429 || !response.ok) {
        console.log(`API error (${response.status}), using fallback question`);
        const randomQuestion = fallbackQuestions[Math.floor(Math.random() * fallbackQuestions.length)];
        setTrivia(randomQuestion);
        setAnswerKey(prev => prev + 1);
        setShowAnswer(false);
        setHasTrivia(true);
        setLoading(false);
        return;
      }
      
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const triviaItem = data.results[0];
        const newTrivia = {
          question: triviaItem.question,
          answer: triviaItem.correct_answer
        };
        setTrivia(newTrivia);
        setAnswerKey(prev => prev + 1);
        setShowAnswer(false);
        setHasTrivia(true);
      } else {
        // No results, use fallback
        console.log('No results from API, using fallback question');
        const randomQuestion = fallbackQuestions[Math.floor(Math.random() * fallbackQuestions.length)];
        setTrivia(randomQuestion);
        setAnswerKey(prev => prev + 1);
        setShowAnswer(false);
        setHasTrivia(true);
      }
    } catch (error) {
      console.log('Fetch error, using fallback question:', error.message);
      const randomQuestion = fallbackQuestions[Math.floor(Math.random() * fallbackQuestions.length)];
      setTrivia(randomQuestion);
      setAnswerKey(prev => prev + 1);
      setShowAnswer(false);
      setHasTrivia(true);
    }
    
    setLoading(false);
  };

  // Track if trivia content actually changed (for moves vs new questions)
  useEffect(() => {
    if (trivia && trivia !== currentTriviaRef.current) {
      currentTriviaRef.current = trivia;
      setHasTrivia(true);
    }
  }, [trivia]);

  // Use fixed font size for trivia questions
  const fontSize = '1.8rem';

  return (
    <div className="trivia-widget">
      <h3>Programming Trivia</h3>
      <button className="remove-widget circular-remove" onClick={() => removeWidget()} title="Remove">
        <CloseIcon fontSize="small" className="close-icon" />
      </button>
      <div className="trivia-controls">
        {hasTrivia && (
          <button
            className={`answer-btn${showAnswer ? ' show' : ''}`}
            onClick={() => {
              const newValue = !showAnswer;
              setShowAnswer(newValue);
            }}
            disabled={!trivia || !trivia.answer || trivia.answer.trim() === '' || loading}
          >
            {showAnswer ? 'Hide Answer' : 'Show Answer'}
          </button>
        )}
        <button
          className="next-trivia-btn"
          onClick={fetchTrivia}
          disabled={loading}
        >
          {'Get Trivia'}
        </button>
      </div>
      {loading ? (
        <div className="trivia-loading">
          <div style={{ fontSize: '1.75rem', color: '#134c72ff', fontWeight: 'bold'  }}>
            Retrieving programming question...
          </div>
        </div>
      ) : trivia ? (
        <div className="trivia-question-container" style={{
          padding: '0 1rem 0 3rem',
          boxSizing: 'border-box',
          position: 'relative',
        }}>
          <blockquote className="trivia-question-blockquote" style={{
            fontSize,
            wordBreak: 'break-word',
            whiteSpace: 'pre-wrap',
            margin: 0,
            maxHeight: '410px',
            position: 'relative',
          }}>
            <span>
              {(() => {
                const q = decodeHtml(trivia.question);
                return q;
              })()}
              {showAnswer && trivia.answer && trivia.answer.trim() !== '' && (
                <span className="trivia-answer-inline">{' — '}{decodeHtml(trivia.answer)}</span>
              )}
            </span>
          </blockquote>
        </div>
      ) : (
        <div className="trivia-loading">Press "Get Trivia" to load a programming question.</div>
      )}
    </div>
  );
}

// Helper to decode HTML entities from API
function decodeHtml(html) {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
}