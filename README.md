# Cook App - Expo Router and Tailwind CSS

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
