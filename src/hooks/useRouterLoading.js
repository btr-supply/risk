import { useEffect, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useLoadingStore } from '../store/useLoadingStore';

export const useRouterLoading = () => {
  const pathname = usePathname();
  const setLoading = useLoadingStore((state) => state.setLoading);

  useEffect(() => {
    // Clear loading when route changes
    setLoading(false);
  }, [pathname, setLoading]);
};

// Custom hook for consistent navigation with loading
export const useNavigateWithLoading = () => {
  const router = useRouter();
  const setLoading = useLoadingStore((state) => state.setLoading);

  const navigateWithLoading = useCallback(
    (path) => {
      setLoading(true);
      router.push(path);
    },
    [router, setLoading]
  );

  return navigateWithLoading;
};
