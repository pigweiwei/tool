import React, { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>React 示例</h1>
      <p>你点击了 {count} 次</p>
      <button onClick={() => setCount(count + 1)}>点击我</button>
    </div>
  );
}

export default App;
