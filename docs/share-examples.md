# Share Function Examples

The `share` function in `lib/share.ts` provides a flexible way to share different types of content in your app.

## Basic Usage

```typescript
import { share } from '~/lib/share';

// Share text
await share('text', 'Hello, world!');

// Share an array of text items (will be joined with newlines)
await share('text', ['Item 1', 'Item 2', 'Item 3']);

// Share a URL
await share('url', 'https://example.com');

// Share an image (using URI)
await share('image', 'file:///path/to/image.jpg');
```

## With Options

```typescript
// Share with a custom dialog title
await share('text', 'Check out this content!', {
  dialogTitle: 'Share with friends',
});

// Share with a subject (for email)
await share('text', 'Important information', {
  subject: 'Please read this',
});

// Share with excluded activity types
await share('url', 'https://example.com', {
  excludedActivityTypes: ['com.apple.UIKit.activity.Print'],
});
```

## Handling Results

```typescript
const result = await share('text', 'Content to share');

if (result.success) {
  // Shared successfully
  if (result.activityType) {
    console.log(`Shared using: ${result.activityType}`);
  }
} else if (result.dismissed) {
  // User dismissed the share sheet
  console.log('Share was dismissed');
} else if (result.error) {
  // An error occurred
  console.error('Share error:', result.error);
}
```

## Use Cases

1. **Shopping Lists**: Share a list of items to buy
2. **Recipes**: Share recipe details with friends
3. **Profile Information**: Share user profile or contact details
4. **Images**: Share images from your app
5. **Deep Links**: Share links that open specific screens in your app
