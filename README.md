# CookApp - Developer Setup Guide

## Project Overview

[![runs with Expo Go](https://img.shields.io/badge/Runs%20with%20Expo%20Go-000.svg?style=flat-square&logo=EXPO&labelColor=f3f3f3&logoColor=000)](https://expo.dev/client)

CookApp is a modern mobile cooking application built with Expo and React Native.
The app helps users discover, create, save, and share cooking recipes with a 
beautiful, responsive UI powered by NativeWind (Tailwind CSS for React Native).

## Tech Stack

- **Framework**: Expo v53 with React Native v0.79
- **UI/Styling**: NativeWind v4 (Tailwind CSS for React Native)
- **Navigation**: Expo Router (file-based routing)
- **State Management**: Zustand
- **Authentication**: Clerk
- **Animations**: React Native Reanimated
- **Icons**: Lucide React Native
- **Package Manager**: pnpm
- **Language**: TypeScript

## Prerequisites

Before setting up the project, ensure you have the following installed:

1. Node.js (v22 or higher)
2. pnpm (v10.11.1 or higher)
3. On device test
   1. For iOS development: Xcode (macOS only) or use Expo Go app
   2. For Android development: Android Studio with SDK or use Expo Go app
   3. For Web: open url in browser

## Initial Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd cookapp-nativewind
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory with the following variables:

```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
EXPO_PUBLIC_LOCAL=true  # Set to false for production
```

### 4. Clerk Authentication Setup
- Sign up at https://clerk.dev/
- Create a new application
- Enable Google, and Apple authentication
- Copy your Publishable Key to the .env file
- Configure OAuth redirect URLs:
  * `cookapp-nativewind://`
  * `https://auth.clerk.dev/v2/client-redirect?...`

## Development Commands

### Start Development Server
```bash
pnpm start          # Start Expo development server
pnpm dev            # Alias for pnpm start
```

### Platform-Specific Development
```bash
pnpm android        # Run on Android device/emulator
pnpm ios            # Run on iOS device/simulator
pnpm web            # Run in web browser
```

### Code Quality
```bash
pnpm lint           # Run ESLint
pnpm format         # Format code with Prettier
pnpm format:check   # Check code formatting
```

### Testing
```bash
pnpm test           # Run tests in watch mode
pnpm test:coverage  # Run tests with coverage report
```

## Project Structure

```
cookapp-nativewind/
├── app/                    # Main application with file-based routing
│   ├── (tabs)/             # Tab navigation structure
│   │   ├── home/           # Home tab - Recipe discovery
│   │   ├── library/        # Library tab - Saved recipes
│   │   └── profile/        # Profile tab - User settings
│   ├── recipes/            # Recipe detail screens
│   └── design/             # Design system components
├── components/             # Reusable UI components
│   ├── ui/                 # Primitive UI components
│   ├── pages/              # Page-specific components
│   └── modals/             # Modal components
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions
├── stores/                 # Zustand state stores
├── types/                  # TypeScript type definitions
├── assets/                 # Static assets (images, fonts, icons)
└── __tests__/              # Test files
```

## Development Workflow

### 1. Starting Development
- Run `pnpm start` to start the Expo development server
- Use Expo Go app on your device or run on simulator/emulator
- The app supports hot reloading for fast development

### 2. Making Changes
- Follow the existing code structure and patterns
- Use TypeScript for type safety
- Follow the component architecture with UI/Page separation
- Use NativeWind classes for styling

### 3. Testing
- Write unit tests for utility functions
- Test components with React Native Testing Library
- Run tests before committing changes

### 4. Code Style
- Use Prettier for code formatting
- Follow ESLint rules
- Use meaningful component and variable names
- Add TypeScript types for all props and functions

## Important Configuration Files

- **app.json**: Expo configuration and app metadata
- **package.json**: Dependencies and scripts
- **tsconfig.json**: TypeScript configuration with path aliases
- **tailwind.config.js**: NativeWind/Tailwind CSS configuration
- **babel.config.js**: Babel configuration for Expo
- **metro.config.js**: Metro bundler configuration
- **jest.config.ts**: Jest testing configuration

## Common Development Tasks

### 1. Adding New Screens
- Create new files in the `app/` directory
- Use Expo Router file-based routing conventions
- Follow the existing layout patterns

### 2. Creating Components
- Add reusable components to `components/ui/`
- Add complete reusable page components to `components/pages/`
- Use TypeScript interfaces for props

### 3. Styling
- Use NativeWind classes for styling
- Follow the design system color scheme
- Ensure responsive design for different screen sizes

### 4. State Management
- Use Zustand stores for global state
- Keep component state local when possible
- Follow the existing store patterns

## Troubleshooting

### Common Issues

1. **Metro bundler cache issues**:
   ```bash
   npx expo start --reset-cache
   ```

2. **iOS simulator not working**:
   - Ensure Xcode is properly installed
   - Try: `npx expo run:ios`

3. **Android emulator issues**:
   - Check Android Studio SDK configuration
   - Try: `npx expo run:android`

4. **Authentication not working**:
   - Verify Clerk configuration
   - Check environment variables
   - Ensure redirect URLs are properly configured

5. **Styling issues**:
   - Clear Metro cache
   - Restart development server
   - Check NativeWind configuration

## Deployment

### For Production Builds
1. Update `app.json` with production configuration
2. Configure EAS Build: `npx eas build:configure`
3. Build for platforms: `npx eas build --platform all`
4. Submit to app stores: `npx eas submit`

## Additional Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [NativeWind Documentation](https://www.nativewind.dev/)
- [Clerk Documentation](https://clerk.com/docs)
- [Zustand Documentation](https://github.com/pmndrs/zustand) 