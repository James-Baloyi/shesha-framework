export interface IAutoLogoutContext {
  timeoutInSeconds: number;
  warningTimeInSeconds: number;
  isWarningVisible: boolean;
  timeRemaining: number;
  resetTimer: () => void;
}

export interface IAutoLogoutSettings {
  autoLogOffTimeout?: number;
}

export const AUTO_LOGOUT_STORAGE_KEY = 'shesha-auto-logout' as const;
export const AUTO_LOGOUT_LAST_ACTIVITY_KEY = 'shesha-last-activity' as const;
export const AUTO_LOGOUT_TAB_ID_KEY = 'shesha-tab-id' as const;

export interface IAutoLogoutMessage {
  type: 'activity' | 'logout' | 'token-refresh';
  timestamp: number;
  tabId: string;
}
