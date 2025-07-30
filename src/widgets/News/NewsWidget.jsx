import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRemoveWidget } from '../../RemoveWidgetContext';

export default function NewsWidget() {    
  const [news, setNews] = useState([]);
  const removeWidget = useRemoveWidget();
//   useEffect(() => {
//     // Example: NewsAPI (replace with your API key)
//     axios.get('https://newsapi.org/v2/top-headlines?country=us&apiKey=YOUR_API_KEY')
//       .then(res => setNews(res.data.articles.slice(0, 3)))
//       .catch(() => setNews(null));
//   }, []);
  return (
    <div className="news-widget">
      <button className="remove-widget" onClick={removeWidget} title="Remove">x</button>
      <h3>Top News</h3>
      {Array.isArray(news) && news.length ? (
        <ul className="news-list">
          {news.map((item, idx) => (
            <li key={idx} className="news-item">
              <a href={item.url} target="_blank" rel="noopener noreferrer">
                <div className="news-title">{item.title}</div>
                <div className="news-meta">
                  <span>{item.source?.name}</span>
                  <span>{item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : ''}</span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
