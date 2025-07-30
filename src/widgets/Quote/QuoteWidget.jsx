import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRemoveWidget } from '../../RemoveWidgetContext';

export default function QuoteWidget() {
  const [quote, setQuote] = useState(null);
  const removeWidget = useRemoveWidget();
//   useEffect(() => {
//     axios.get('https://api.quotable.io/random')
//       .then(res => setQuote(res.data))
//       .catch(() => setQuote(null));
//   }, []);
  return (
    <div className="widget quote-widget">
      <button className="remove-widget" onClick={removeWidget} title="Remove">x</button>
      <h3>Quote</h3>
      {quote ? (
        <div>
          <blockquote>{quote.content}</blockquote>
          <div>- {quote.author}</div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
