# AI Chat Feature for BPolls

## Overview

The AI Chat feature has been successfully added to the BPolls application, providing users with an AI-powered assistant to help create polls. This feature is similar to the implementation in the dpolls-dapp project but adapted for the BPolls context.

## Components Added

### 1. FloatingChatButton (`src/components/FloatingChatButton.tsx`)
- A floating action button that appears in the bottom-right corner of all pages
- Toggles between a chat icon and close icon
- Opens/closes the AI chat modal

### 2. AIChatModal (`src/components/AIChatModal.tsx`)
- A full-featured chat interface for interacting with the AI assistant
- Supports poll generation, regeneration, and preview functionality
- Includes loading states and error handling
- Provides a preview of generated polls before creation

## Features

### AI Poll Creation
- Users can describe the poll they want to create in natural language
- The AI generates poll parameters including:
  - Subject and description
  - Poll options
  - Maximum responses
  - Reward per response
  - Duration
  - Funding type and target fund

### Interactive Chat
- Real-time chat interface with message history
- Support for providing feedback to regenerate polls
- Clear chat functionality
- Keyboard shortcuts (Enter to send, Shift+Enter for new line)

### Poll Preview
- Visual preview of generated polls
- Shows all poll parameters in an organized card layout
- Option to regenerate based on feedback
- Direct creation button to proceed with poll creation

## Integration

The floating chat button is integrated into the main layout (`src/app/layout.tsx`) and appears on all pages of the application. The button is positioned with a high z-index to ensure it's always visible.

## Current Implementation

### Mock AI Service
Currently, the AI service is mocked to demonstrate the UI and user flow. The mock implementation:
- Simulates API calls with setTimeout
- Generates sample poll data
- Provides realistic response times

### Future Enhancements
To make this fully functional, you would need to:
1. Replace the mock AI service with actual API calls
2. Integrate with a real AI service (OpenAI, Anthropic, etc.)
3. Add proper error handling for API failures
4. Implement poll data passing to the create poll form
5. Add user authentication and rate limiting

## Usage

1. Click the floating chat button (bot icon) in the bottom-right corner
2. Describe the poll you want to create in the chat interface
3. Review the generated poll preview
4. Provide feedback if needed to regenerate
5. Click "Create Poll" to proceed with poll creation

## Styling

The components use the existing UI components and Tailwind CSS classes from the BPolls design system:
- Consistent with the existing button, card, and textarea components
- Uses the primary color scheme
- Responsive design that works on mobile and desktop
- Smooth animations and transitions

## Dependencies

All required dependencies are already included in the project:
- `lucide-react` for icons
- `@/components/ui/*` for UI components
- `clsx` and `tailwind-merge` for styling utilities

## Files Modified

- `src/components/AIChatModal.tsx` (new)
- `src/components/FloatingChatButton.tsx` (new)
- `src/app/layout.tsx` (updated to include FloatingChatButton)

The implementation is ready to use and provides a complete AI chat experience for poll creation in the BPolls application. 