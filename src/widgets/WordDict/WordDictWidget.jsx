import { useEffect, useState } from 'react';
import { useRemoveWidget } from '../../RemoveWidgetContext';
import './WordDictWidget.css';
import CloseIcon from '@mui/icons-material/Close';

export default function WordDictWidget({ index }) {    
  const [wordData, setWordData] = useState(null);
  const [loading, setLoading] = useState(false);
  const removeWidget = useRemoveWidget(index);

  // Fallback words array
  const fallbackWords = [
    {
      word: "serendipity",
      meanings: [{
        partOfSpeech: "noun",
        definitions: [{
          definition: "The occurrence and development of events by chance in a happy or beneficial way."
        }]
      }]
    },
    {
      word: "ephemeral",
      meanings: [{
        partOfSpeech: "adjective",
        definitions: [{
          definition: "Lasting for a very short time."
        }]
      }]
    },
    {
      word: "ubiquitous",
      meanings: [{
        partOfSpeech: "adjective",
        definitions: [{
          definition: "Present, appearing, or found everywhere."
        }]
      }]
    },
    {
      word: "meticulous",
      meanings: [{
        partOfSpeech: "adjective",
        definitions: [{
          definition: "Showing great attention to detail; very careful and precise."
        }]
      }]
    },
    {
      word: "eloquent",
      meanings: [{
        partOfSpeech: "adjective",
        definitions: [{
          definition: "Fluent or persuasive in speaking or writing."
        }]
      }]
    }
  ];
  
  const fetchWordDefinition = async () => {
    setLoading(true);
    
    try {
      // Try to get a random word from API first
      const randomWordResponse = await fetch('https://api.wordnik.com/v4/words.json/randomWord?hasDictionaryDef=true&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5');
      
      if (randomWordResponse.ok) {
        const randomWordData = await randomWordResponse.json();
        const randomWord = randomWordData.word;
        
        // Get definition for the random word
        const definitionResponse = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${randomWord}`);
        
        if (definitionResponse.ok) {
          const data = await definitionResponse.json();
          setWordData(data[0]);
          setLoading(false);
          return;
        }
      }
      
      // If API fails, use fallback words
      throw new Error('API failed, using fallback');
      
    } catch (error) {
      console.log('Using fallback word due to API error:', error.message);
      
      // Use fallback words
      const randomFallback = fallbackWords[Math.floor(Math.random() * fallbackWords.length)];
      setWordData(randomFallback);
    }
    
    setLoading(false);
  };
  
  return (
    <div className="worddict-widget">
      <h3>Word Dictionary</h3>
      <button className="remove-widget circular-remove" onClick={() => removeWidget()} title="Remove">
        <CloseIcon fontSize="small" className="close-icon" />
      </button>
      
      <div className="worddict-controls">
        <button
          className="get-word-btn"
          onClick={fetchWordDefinition}
          disabled={loading}
        >
          {'Get Word'}
        </button>
      </div>

      <div className="worddict-container">
        {loading ? (
          <div className="worddict-loading">
              Getting random word...
          </div>
        ) : wordData ? (
            <blockquote className="worddict-blockquote">
              {/* Word Title */}
              <div className="word-title">
                {wordData.word}
              </div>

              {/* Part of Speech */}
              {wordData.meanings && wordData.meanings.length > 0 && (
                <div className="parts-of-speech">
                  <strong>Part of Speech:</strong> {wordData.meanings[0].partOfSpeech}
                </div>
              )}

              {/* Definition */}
              {wordData.meanings && wordData.meanings[0]?.definitions[0] && (
                <div className="main-definition">
                  <strong>Definition:</strong> {wordData.meanings[0].definitions[0].definition}
                </div>
              )}
            </blockquote>
        ) : (
          <div className="worddict-loading">Press "Get Word" to load a random word definition.</div>
        )}
      </div>
    </div>
  );
}
