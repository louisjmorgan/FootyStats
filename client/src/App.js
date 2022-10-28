import { Route, Routes } from 'react-router-dom';
import { Home, Match } from 'pages';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/matches/:id" element={<Match />} />
    </Routes>
  );
}

export default App;
