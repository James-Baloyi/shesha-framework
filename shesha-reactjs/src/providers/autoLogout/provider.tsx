import React, { FC, PropsWithChildren, useCallback, useEffect, useRef, useState } from 'react';
import { App } from 'antd';
import { useAuth } from '@/providers/auth';
import { useNextRouter } from '@/hooks/useNextRouter';
import { AutoLogoutContext } from './contexts';
import { AutoLogoutWarningDialog } from './warningDialog';
import { TokenExpirationOverlay } from './tokenExpirationOverlay';
import {
  IAutoLogoutContext,
  IAutoLogoutMessage,
  AUTO_LOGOUT_LAST_ACTIVITY_KEY,
  AUTO_LOGOUT_TAB_ID_KEY,
} from './models';
import { nanoid } from '@/utils/uuid';
import { getLocalStorage } from '@/utils/storage';
import { getAccessToken } from '@/utils/auth';
import { DEFAULT_ACCESS_TOKEN_NAME } from '@/providers/sheshaApplication/contexts';

const ACTIVITY_EVENTS = ['mousedown', 'keydown', 'scroll', 'touchstart'];
const WARNING_TIME = 60;
const CHECK_INTERVAL = 1000;
const TOKEN_RENEWAL_BUFFER = 120;
const SIMULATED_TOKEN_EXPIRY_SECONDS = 30;

const AutoLogoutProvider: FC<PropsWithChildren> = ({ children }) => {
  const auth = useAuth();
  const router = useNextRouter();
  const { notification } = App.useApp();

  const [timeoutInSeconds, setTimeoutInSeconds] = useState<number>(0);
  const [isWarningVisible, setIsWarningVisible] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isTokenExpired, setIsTokenExpired] = useState(false);

  const tabIdRef = useRef<string>(nanoid());
  const lastActivityRef = useRef<number>(Date.now());
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const channelRef = useRef<BroadcastChannel | null>(null);
  const hasLoggedOutRef = useRef(false);
  const isWarningVisibleRef = useRef(false);
  const lastTokenRenewalRef = useRef<number>(0);
  const tokenFirstSeenRef = useRef<number>(0);

  const getActiveTabs = useCallback((): string[] => {
    const storage = getLocalStorage();
    const tabsData = storage?.getItem(AUTO_LOGOUT_TAB_ID_KEY);
    if (!tabsData) return [];
    try {
      const parsed: unknown = JSON.parse(tabsData);
      if (Array.isArray(parsed) && parsed.every((item) => typeof item === 'string')) {
        return parsed;
      }
      return [];
    } catch {
      return [];
    }
  }, []);

  const setActiveTabs = useCallback((tabs: string[]) => {
    const storage = getLocalStorage();
    storage?.setItem(AUTO_LOGOUT_TAB_ID_KEY, JSON.stringify(tabs));
  }, []);

  // Tab registration uses a best-effort retry-with-verification approach to mitigate
  // race conditions in concurrent tab registrations. Due to the non-atomic nature of
  // localStorage read-modify-write operations, updates can still be lost under high
  // concurrency. For strict correctness in "last tab logout" logic, consider using
  // cross-tab locks (e.g., via IndexedDB), server-side state, BroadcastChannel with
  // consensus protocols, or SharedWorker for coordinated tab management.
  const registerTab = useCallback(() => {
    const maxRetries = 3;
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      const tabs = getActiveTabs();
      if (!tabs.includes(tabIdRef.current)) {
        const updatedTabs = [...tabs, tabIdRef.current];
        setActiveTabs(updatedTabs);
        const verifyTabs = getActiveTabs();
        if (verifyTabs.includes(tabIdRef.current)) {
          return;
        }
      } else {
        return;
      }
    }
  }, [getActiveTabs, setActiveTabs]);

  const unregisterTab = useCallback(() => {
    const maxRetries = 3;
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      const tabs = getActiveTabs();
      const filtered = tabs.filter((id) => id !== tabIdRef.current);
      setActiveTabs(filtered);
      const verifyTabs = getActiveTabs();
      if (!verifyTabs.includes(tabIdRef.current)) {
        return filtered.length === 0;
      }
    }
    return false;
  }, [getActiveTabs, setActiveTabs]);

  const broadcastMessage = useCallback((type: IAutoLogoutMessage['type']) => {
    if (channelRef.current) {
      const message: IAutoLogoutMessage = {
        type,
        timestamp: Date.now(),
        tabId: tabIdRef.current,
      };
      channelRef.current.postMessage(message);
    }
  }, []);

  const updateLastActivity = useCallback(() => {
    const now = Date.now();
    lastActivityRef.current = now;
    const storage = getLocalStorage();
    storage?.setItem(AUTO_LOGOUT_LAST_ACTIVITY_KEY, now.toString());
    broadcastMessage('activity');
  }, [broadcastMessage]);

  const resetTimer = useCallback(() => {
    if (!auth.isLoggedIn || timeoutInSeconds <= 0) return;

    updateLastActivity();
    setIsWarningVisible(false);
    setTimeRemaining(0);
  }, [auth.isLoggedIn, timeoutInSeconds, updateLastActivity]);

  const performLogout = useCallback(async () => {
    if (hasLoggedOutRef.current) return;
    hasLoggedOutRef.current = true;

    setIsWarningVisible(false);

    try {
      await auth.logoutUser();
      notification.warning({
        message: 'Session Expired',
        description: 'You have been logged out due to inactivity.',
      });
    } catch (error) {
      console.error('Error during auto-logout:', error);
    }
  }, [auth, notification]);


  const handleStayLoggedIn = useCallback(() => {
    resetTimer();
    broadcastMessage('token-refresh');

    const token = getAccessToken(DEFAULT_ACCESS_TOKEN_NAME);
    if (token) {
      tokenFirstSeenRef.current = Date.now();

      auth.refetchProfileAsync().catch((error) => {
        console.error('Failed to renew token after staying logged in:', error);
        notification.error({
          message: 'Session Renewal Failed',
          description: 'Unable to extend your session. You may be logged out soon.',
        });
      });
    }
  }, [resetTimer, broadcastMessage, auth, notification]);

  useEffect(() => {
    if (!auth.isLoggedIn) return;

    const mockTimeout = 300;
    setTimeoutInSeconds(mockTimeout);
    updateLastActivity();
  }, [auth.isLoggedIn, updateLastActivity]);

  useEffect(() => {
    if (!auth.isLoggedIn || timeoutInSeconds <= 0) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    channelRef.current = new BroadcastChannel('shesha-auto-logout');

    channelRef.current.onmessage = (event: MessageEvent<IAutoLogoutMessage>) => {
      const message = event.data;
      if (message.tabId === tabIdRef.current) return;

      if (message.type === 'activity' || message.type === 'token-refresh') {
        lastActivityRef.current = message.timestamp;
        setIsWarningVisible(false);
        setTimeRemaining(0);
      } else if (message.type === 'logout') {
        if (!hasLoggedOutRef.current) {
          performLogout();
        }
      }
    };

    registerTab();

    const handleActivity = (): void => {
      if (isWarningVisibleRef.current) {
        handleStayLoggedIn();
      } else {
        updateLastActivity();
      }
    };

    ACTIVITY_EVENTS.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    timerRef.current = setInterval(() => {
      const token = getAccessToken(DEFAULT_ACCESS_TOKEN_NAME);
      const now = Date.now();
      const storage = getLocalStorage();
      const storedActivity = storage?.getItem(AUTO_LOGOUT_LAST_ACTIVITY_KEY);
      const lastActivity = storedActivity ? parseInt(storedActivity, 10) : lastActivityRef.current;
      const timeSinceLastActivity = Math.floor((now - lastActivity) / 1000);

      if (token) {
        if (tokenFirstSeenRef.current === 0) {
          tokenFirstSeenRef.current = now;
        }

        const tokenAge = Math.floor((now - tokenFirstSeenRef.current) / 1000);
        const timeUntilTokenExpiry = SIMULATED_TOKEN_EXPIRY_SECONDS - tokenAge;

        if (timeUntilTokenExpiry <= 0) {
          setIsTokenExpired(true);
          return;
        }

        const isUserActive = timeSinceLastActivity < TOKEN_RENEWAL_BUFFER;

        if (timeUntilTokenExpiry <= TOKEN_RENEWAL_BUFFER &&
          isUserActive &&
          (now - lastTokenRenewalRef.current) > TOKEN_RENEWAL_BUFFER * 1000) {
          lastTokenRenewalRef.current = now;
          tokenFirstSeenRef.current = now;
          auth.refetchProfileAsync().catch((error) => {
            console.error('Failed to renew token:', error);
          });
        }
      }

      const inactiveTime = timeSinceLastActivity;
      const timeUntilLogout = timeoutInSeconds - inactiveTime;

      if (timeUntilLogout <= 0) {
        if (!hasLoggedOutRef.current) {
          broadcastMessage('logout');
          performLogout();
        }
      } else if (timeUntilLogout <= WARNING_TIME && !isWarningVisibleRef.current) {
        setIsWarningVisible(true);
        setTimeRemaining(timeUntilLogout);
      } else if (isWarningVisibleRef.current && timeUntilLogout <= WARNING_TIME) {
        setTimeRemaining(timeUntilLogout);
      } else if (timeUntilLogout > WARNING_TIME && isWarningVisibleRef.current) {
        setIsWarningVisible(false);
        setTimeRemaining(0);
      }
    }, CHECK_INTERVAL);

    // Synchronous cleanup during page unload to avoid stale tab entries.
    // Timers scheduled in beforeunload may not execute reliably during navigation.
    const handleBeforeUnload = (): void => {
      const isLastTab = unregisterTab();
      if (isLastTab && auth.isLoggedIn) {
        const storage = getLocalStorage();
        storage?.setItem('shesha-logout-sentinel', Date.now().toString());
        broadcastMessage('logout');
      }
    };

    const handleVisibilityChange = (): void => {
      if (document.visibilityState === 'visible') {
        registerTab();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      ACTIVITY_EVENTS.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);

      if (channelRef.current) {
        channelRef.current.close();
      }

      unregisterTab();
    };
  }, [
    auth,
    timeoutInSeconds,
    updateLastActivity,
    broadcastMessage,
    performLogout,
    handleStayLoggedIn,
    registerTab,
    unregisterTab,
  ]);

  useEffect(() => {
    hasLoggedOutRef.current = !auth.isLoggedIn;
    if (!auth.isLoggedIn) {
      tokenFirstSeenRef.current = 0;
    }
  }, [auth.isLoggedIn]);

  useEffect(() => {
    isWarningVisibleRef.current = isWarningVisible;
  }, [isWarningVisible]);

  const handleTokenExpiredLogin = useCallback(() => {
    setIsTokenExpired(false);
    tokenFirstSeenRef.current = 0;
    router.push('/login');
  }, [router]);

  const contextValue: IAutoLogoutContext = {
    timeoutInSeconds: 100,
    warningTimeInSeconds: WARNING_TIME,
    isWarningVisible,
    timeRemaining,
    resetTimer,
  };

  return (
    <AutoLogoutContext.Provider value={contextValue}>
      {children}
      {auth.isLoggedIn && timeoutInSeconds > 0 && (
        <AutoLogoutWarningDialog
          visible={isWarningVisible}
          timeRemaining={timeRemaining}
          onStayLoggedIn={handleStayLoggedIn}
          onLogout={performLogout}
        />
      )}
      <TokenExpirationOverlay
        visible={isTokenExpired}
        onLogin={handleTokenExpiredLogin}
      />
    </AutoLogoutContext.Provider>
  );
};

export default AutoLogoutProvider;
