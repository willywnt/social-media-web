import './App.css';
import { Home, DetailPost, DetailUser } from './pages';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="post/:postId" element={<DetailPost />} /> */}
        <Route path="user/:userId" element={<DetailUser />} />
      </Routes>
    </div>
  );
}

export default App;
