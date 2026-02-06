import { useEffect } from 'react';
import useAuthStore from '../stores/authStore';

export default function useAuth() {
  const { user, isAuthenticated, loading, fetchUser } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && !user) fetchUser();
    else if (!isAuthenticated) useAuthStore.setState({ loading: false });
  }, [isAuthenticated, user, fetchUser]);

  return { user, isAuthenticated, loading };
}
