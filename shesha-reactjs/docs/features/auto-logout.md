# Auto Logout Feature

## Overview

The Auto Logout feature provides automatic session management based on user inactivity and token expiration. This enhances security by ensuring users are logged out when inactive for a configurable period and handles token expiration gracefully.

## Features

### 1. Configurable Timeout
- Auto logout is controlled by the backend setting: `Shesha > Security.AutoLogOffTimeout`
- When set to a value greater than 0 (in seconds), auto logout is automatically enabled
- When set to 0 or not configured, auto logout is disabled

### 2. Inactivity Detection
The system monitors user activity through the following events:
- Mouse clicks (`mousedown`)
- Keyboard input (`keydown`)
- Scrolling (`scroll`)
- Touch events (`touchstart`)

Any of these activities reset the inactivity timer.

### 3. Warning Dialog
- 60 seconds before the timeout expires, a warning dialog is displayed
- The dialog shows:
  - Session timeout warning message
  - Countdown timer with visual progress bar
  - Two action buttons:
    - **Stay Logged In**: Resets the inactivity timer and keeps the user logged in
    - **Logout Now**: Immediately logs out the user

### 4. Automatic Token Renewal
- The system monitors token expiration independently of the inactivity timeout
- If the token is about to expire (within 120 seconds) AND the user has been active recently (within last 120 seconds), the token is automatically renewed
- This ensures active users don't get logged out due to token expiration

### 5. Token Expiration Detection
- If the token expires (e.g., user was inactive and token wasn't renewed), the system:
  - Detects the expiration immediately
  - Displays a "Session Expired" overlay
  - Blocks all application content
  - Provides a "Login Again" button to redirect to the login page

### 6. Multi-Tab Synchronization
- All browser tabs running the application communicate via BroadcastChannel
- Activity in any tab updates the last activity timestamp for all tabs
- When one tab triggers logout, all other tabs are notified and logged out simultaneously
- This ensures consistent session state across the application

### 7. Tab Close Handling
- When a browser tab is closed, the system detects it
- If it's the last open tab for the application:
  - User is automatically logged out after a 2-second delay
  - Token is invalidated on the backend
- If other tabs remain open, the tab is simply unregistered without logging out

### 8. Session Synchronization Features
- Last activity timestamp is stored in localStorage and shared across tabs
- Active tab registration ensures the system knows which tabs are open
- Visibility change detection handles tab switching and prevents premature logout

## Configuration

### Backend Configuration

Set the auto logout timeout in your backend settings:

```
Module: Shesha
Setting: Security.AutoLogOffTimeout
Value: [timeout in seconds, e.g., 1800 for 30 minutes]
```

To disable auto logout, set the value to 0.

### Frontend Integration

The AutoLogoutProvider is automatically integrated into the application when authentication is enabled. It's wrapped around the authenticated portion of your app:

```tsx
<AuthProvider>
  <AutoLogoutProvider>
    {/* Your authenticated app content */}
  </AutoLogoutProvider>
</AuthProvider>
```

## Technical Details

### Constants

- `WARNING_TIME`: 60 seconds - Time before logout when warning dialog appears
- `CHECK_INTERVAL`: 1000ms - Frequency of inactivity and token expiration checks
- `TAB_CLOSE_TIMEOUT`: 2000ms - Delay before logout when last tab is closed
- `TOKEN_RENEWAL_BUFFER`: 120 seconds - Time before token expiration to trigger renewal

### Activity Events

The system listens to these DOM events to detect user activity:
- `mousedown` - Mouse clicks
- `keydown` - Keyboard input
- `scroll` - Page scrolling
- `touchstart` - Touch interactions on mobile devices

### Storage Keys

- `shesha-last-activity` - Timestamp of last user activity
- `shesha-tab-id` - Array of active tab IDs
- Access token stored under configured token name (default: `Shesha.AccessToken`)

### BroadcastChannel Messages

The system uses `shesha-auto-logout` BroadcastChannel with these message types:
- `activity` - User performed an action
- `token-refresh` - User clicked "Stay Logged In"
- `logout` - User/system initiated logout

## User Experience Flow

### Normal Session
1. User logs in
2. User interacts with the application
3. Activity resets the timer continuously
4. Token is automatically renewed when needed if user is active

### Inactivity Warning
1. User becomes inactive for (timeout - 60) seconds
2. Warning dialog appears with countdown
3. User can:
   - Click "Stay Logged In" to reset timer
   - Click "Logout Now" to logout immediately
   - Continue being inactive and get auto-logged out when timer reaches 0

### Token Expiration
1. Token expires (e.g., after prolonged inactivity)
2. "Session Expired" overlay appears
3. Application content is blocked
4. User must click "Login Again" to re-authenticate

### Multi-Tab Behavior
1. User opens multiple tabs
2. Activity in any tab keeps all tabs active
3. Closing all but one tab doesn't trigger logout
4. Closing the last tab triggers logout after 2 seconds
5. If user switches back to a tab before 2 seconds, logout is cancelled

## Edge Cases Handled

### Browser Crash or Force Quit
- The backend should have its own token expiration logic
- When the frontend reconnects, it will detect the expired token
- User will see the "Session Expired" overlay

### Network Loss
- Local timer continues running
- When network reconnects, token expiration is detected
- User is prompted to login again if needed

### Clock Skew
- System uses relative time calculations where possible
- Token expiration uses server-provided expiration timestamps

### Rapid Tab Opening/Closing
- 2-second delay prevents premature logout
- Visibility change detection helps identify real tab closes

## Best Practices

1. **Set Appropriate Timeout**: Balance security and user convenience (typical range: 900-3600 seconds)
2. **Monitor Token Lifetime**: Ensure backend token lifetime is longer than the inactivity timeout
3. **Test Multi-Tab Scenarios**: Verify behavior with multiple tabs open
4. **Consider User Workflows**: For long-running tasks, users should be educated to interact periodically

## Troubleshooting

### Auto Logout Not Working
- Check if `Security.AutoLogOffTimeout` setting is > 0
- Verify the user is authenticated
- Check browser console for errors
- Ensure BroadcastChannel is supported (modern browsers)

### Token Renewal Failing
- Check network connectivity
- Verify backend session endpoint is responding
- Check browser console for API errors
- Ensure token hasn't been revoked on backend

### Warning Dialog Not Appearing
- Verify timeout setting is greater than 60 seconds
- Check if user is actually inactive
- Verify component is properly mounted

### Multi-Tab Issues
- Clear localStorage and refresh all tabs
- Check if BroadcastChannel is working in the browser
- Verify no browser extensions are blocking cross-tab communication
