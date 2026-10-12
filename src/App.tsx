import { Routes, Route, Navigate } from 'react-router-dom';
import UserList from './components/Users/UserList';
import UserPosts from './components/Users/UserPosts';
import UserProfile from './components/User/UserProfile';
import Layout from './components/Layout';
import LoginPage from './components/Auth/LoginPage';
import ContactsPage from './components/Contacts/ContactsPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<Layout />}>
        <Route path="/users" element={<UserList />} />
        <Route path="/users/:id/posts" element={<UserPosts />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route
          path="/contacts"
          element={
            <ProtectedRoute>
              <ContactsPage />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="/" element={<Navigate to="/users" />} />
    </Routes>
  );
}

export default App;