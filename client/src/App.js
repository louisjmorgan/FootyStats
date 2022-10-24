import { Route, Routes } from 'react-router-dom';
import { Home, Match } from 'pages';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/matches/:id" element={<Match />} />
      </Routes>
    </div>
  );
}

export default App;
