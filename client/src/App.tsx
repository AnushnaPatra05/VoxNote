import { AuthProvider, useAuth } from './hooks/useAuth';
import Dashboard from './pages/Dashboard';
import AuthPage from './pages/AuthPage';

const AppRouter = () => {
  const { user } = useAuth();
  return user ? <Dashboard /> : <AuthPage />;
};

const App = () => (
  <AuthProvider>
    <AppRouter />
  </AuthProvider>
);

export default App;
