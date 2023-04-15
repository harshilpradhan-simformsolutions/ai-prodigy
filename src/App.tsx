import { Route, Routes } from 'react-router-dom';
import { Header } from './components';
import { Home } from './pages/Home';
import { Users } from './pages/Users';
import { Posts } from './pages/Posts';
import { SingleUser } from './pages/SingleUser';
import { ActiveUsers } from './pages/ActiveUsers';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Header />}>
          <Route index element={<Home />} />
          <Route path="users" element={<Users />} />
          <Route path="posts" element={<Posts />} />
          <Route path="users/:id" element={<SingleUser />} />
          <Route path="active" element={<ActiveUsers />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
