# Poll Administration Updates

## Changes Made:

### 1. **Status Management UI**
- **Before**: Individual buttons for each status (Open, Funding, Claiming, Closed)
- **After**: Select dropdown + Submit button approach

### 2. **Closed Poll Handling**
- **Before**: Status buttons shown for all polls
- **After**: Status management hidden for ended/closed polls with explanatory message

### 3. **State Management**
- Added `statusUpdates` state to track pending status changes
- Select dropdown shows current status by default
- Submit button only enabled when status is different from current

### 4. **User Experience**
- Clear feedback when polls cannot be modified
- Single submit action instead of multiple buttons
- Status cleared after successful submission

## UI Flow:
1. User selects new status from dropdown
2. Submit button becomes enabled if status differs from current
3. User clicks Submit to trigger blockchain transaction
4. Success: Status cleared, UI refreshed
5. Error: Status remains in dropdown for retry

## Status Visibility:
- **Active polls**: Show status dropdown + submit button
- **Ended/Closed polls**: Show "This poll has ended and cannot be modified" message
- **Non-manageable polls**: No status management section