import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRemoveWidget } from '../../RemoveWidgetContext';

export default function StockWidget() {
  const [stock, setStock] = useState(null);
  const removeWidget = useRemoveWidget();
//   useEffect(() => {
//     // Example: Financial Modeling Prep API (replace with your API key and symbol)
//     axios.get('https://financialmodelingprep.com/api/v3/quote/AAPL?apikey=YOUR_API_KEY')
//       .then(res => setStock(res.data[0]))
//       .catch(() => setStock(null));
//   }, []);
  return (
    <div className="widget stock-widget">
      <button className="remove-widget" onClick={removeWidget} title="Remove">x</button>
      <h3>Stock</h3>
      {stock ? (
        <div>
          <div>{stock.symbol}</div>
          <div>${stock.price}</div>
          <div>{stock.name}</div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
