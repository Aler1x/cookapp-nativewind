# Cook App - Expo Router and Tailwind CSS

[![runs with Expo Go](https://img.shields.io/badge/Runs%20with%20Expo%20Go-000.svg?style=flat-square&logo=EXPO&labelColor=f3f3f3&logoColor=000)](https://expo.dev/client)

Use [Expo Router](https://docs.expo.dev/router/introduction/) with [Nativewind](https://www.nativewind.dev/v4/overview/) styling and Clerk authentication.

## Getting Started

Clone the project and run `pnpm install` to install dependencies.

### Setting Up Authentication

This app uses [Clerk](https://clerk.dev/) for authentication. You'll need to set up a Clerk account and create a new application.

1. Sign up for a Clerk account at [https://clerk.dev/](https://clerk.dev/)
2. Create a new application in the Clerk Dashboard
3. Configure your application to enable Email/Password, Google, and Apple authentication methods
4. Copy your Publishable Key from the Clerk Dashboard
5. Create a `.env` file based on `.env.example` and add your Publishable Key:

```
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key_here
```

#### Setting up OAuth (Google and Apple)

For Google OAuth:

1. In the Clerk Dashboard, go to JWT Templates and create a Google OAuth template
2. Add the required redirect URLs: `cookapp-nativewind://` and `https://auth.clerk.dev/v2/client-redirect?...` (Clerk will provide the exact URL)
3. Configure your Google Cloud Console project to enable the Google Sign-In OAuth API

For Apple OAuth (iOS only):

1. In the Clerk Dashboard, go to JWT Templates and create an Apple OAuth template
2. Set up an Apple Developer account and configure Sign in with Apple
3. Add the required redirect URLs in your Apple Developer console

### Running the project

Run `pnpm start` to start the project.

## Authentication Features

The app includes:

- Email/password authentication (sign in and sign up)
- Google OAuth authentication
- Apple OAuth authentication (iOS only)
- Authenticated routes protection
- Sign out functionality

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.

# CookApp Architecture

## Overview

CookApp is a mobile application built with Expo and React Native that helps users discover, create, save, and share cooking recipes. The app features a modern UI with NativeWind (Tailwind CSS for React Native) styling and follows a tab-based navigation structure.

## Tech Stack

- **Framework**: [Expo](https://expo.dev/) (v53) with React Native (v0.79)
- **UI/Styling**: [NativeWind](https://nativewind.dev/) (Tailwind CSS for React Native)
- **Navigation**: [Expo Router](https://docs.expo.dev/routing/introduction/) for file-based routing
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Authentication**: [Clerk](https://clerk.com/)
- **Animations**: React Native Reanimated
- **Icons**: Lucide React Native

## Project Structure

```
cookapp-nativewind/
├── app/                    # Main application code with file-based routing
│   ├── (tabs)/             # Tab-based navigation structure
│   │   ├── home/           # Home tab - Recipe discovery
│   │   ├── library/        # Library tab - Saved recipes
│   │   ├── create/         # Create tab - Recipe creation
│   │   ├── shopping/       # Shopping tab - Shopping lists
│   │   └── profile/        # Profile tab - User settings
│   ├── recipes/            # Recipe detail views and related screens
│   └── auth.tsx            # Authentication screens
├── components/             # Reusable UI components
│   ├── ui/                 # Primitive UI components (buttons, inputs, etc.)
│   ├── pages/              # Page-specific components
│   └── [component files]   # Standalone components (nav-bar, footer, etc.)
├── lib/                    # Utility functions and hooks
├── stores/                 # State management with Zustand
├── types/                  # TypeScript type definitions
├── assets/                 # Static assets (images, fonts, icons)
└── mockup/                 # Design mockups and prototypes
```

## Architecture Patterns

### File-Based Routing

The app uses Expo Router for file-based routing, organizing navigation through the file system:

- `app/_layout.tsx`: Root layout component
- `app/(tabs)/_layout.tsx`: Tab navigation layout
- Each tab and sub-route is represented by its own directory

### Component Architecture

Components follow a functional approach with clear separation of concerns:

1. **UI Components**: Reusable, stateless components for building the interface
2. **Page Components**: Compositions of UI components with business logic
3. **Layouts**: Define the structure and common elements across multiple screens

### State Management

The app uses Zustand for global state management with a simple, hook-based API:

- Stores are organized by domain
- Persistent state uses AsyncStorage via Zustand middleware

### API Communication

- Custom `useRest` hook for handling API requests and responses
- Authentication state is managed through Clerk and stored securely

## Key Features

1. **Recipe Discovery**: Browse, search, and filter recipes
2. **Recipe Creation**: Create and edit personal recipes
3. **Recipe Library**: Save favorite recipes for quick access
4. **Shopping Lists**: Generate and manage shopping lists based on recipes
5. **User Profiles**: Manage account preferences and settings

## UI/UX Design Principles

- **Responsive Design**: Adapts to different screen sizes
- **Accessibility**: Follows React Native accessibility guidelines
- **Dark Mode Support**: Uses color scheme detection for theme switching
- **Animations**: Subtle animations for enhanced user experience

## Development Workflow

1. Use `pnpm` as the package manager
2. Run development server with `pnpm dev`
3. Build for specific platforms with `pnpm ios`, `pnpm android`, or `pnpm web`

## Future Considerations

- Implement social features (sharing, following)
- Add offline capabilities
- Enhance personalization based on user preferences
- Implement analytics for usage insights
