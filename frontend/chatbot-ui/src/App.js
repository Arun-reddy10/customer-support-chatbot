import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');

  const handleSubmit = async () => {
    if (query.includes('top') && query.includes('sold')) {
      const res = await axios.get('http://localhost:3001/top-products');
      setResponse(JSON.stringify(res.data));
    } else if (query.includes('order ID')) {
      const id = query.match(/\d+/)[0];
      const res = await axios.get(`http://localhost:3001/order-status/${id}`);
      setResponse(JSON.stringify(res.data));
    } else if (query.includes('left in stock')) {
      const name = query.split(' ').slice(-2).join(' ');
      const res = await axios.get(`http://localhost:3001/stock/${name}`);
      setResponse(JSON.stringify(res.data));
    } else {
      setResponse('Sorry, I cannot understand that yet.');
    }
  };
  

  return (
    <div style={{ padding: '20px' }}>
      <h1>Customer Support Chatbot</h1>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <button onClick={handleSubmit}>Ask</button>
      <pre>{response}</pre>
    </div>
  );
}

export default App;