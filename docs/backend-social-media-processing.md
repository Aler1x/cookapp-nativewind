# Backend Requirements for Social Media Recipe Processing

## Overview

This document outlines the backend requirements for implementing social media recipe processing with push notifications in the CookApp.

## Required Endpoints

### 1. Store Push Notification Token

**Endpoint:** `POST /users/{userId}/push-token`

**Purpose:** Store the user's push notification token for sending notifications when processing is complete.

**Request Body:**
```json
{
  "token": "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]",
  "type": "expo",
  "platform": "ios|android"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Push token stored successfully"
}
```

### 2. Process Social Media Recipe

**Endpoint:** `POST /users/{userId}/recipes/process-social`

**Purpose:** Receive a social media URL and start background processing to extract recipe data.

**Request Body:**
```json
{
  "url": "https://www.instagram.com/p/xyz123/"
}
```

**Response:**
```json
{
  "success": true,
  "processingId": "uuid-processing-id",
  "message": "Recipe processing started"
}
```

## Background Processing Requirements

### 1. Recipe Data Extraction

The backend should implement a system to extract recipe information from various social media platforms:

**Supported Platforms:**
- Instagram posts/reels
- TikTok videos
- YouTube videos
- Recipe websites (AllRecipes, Food Network, etc.)

**Extracted Data:**
```json
{
  "title": "Delicious Chocolate Cake",
  "description": "A rich and moist chocolate cake recipe",
  "ingredients": [
    {
      "name": "flour",
      "amount": "2 cups",
      "unit": "cups"
    }
  ],
  "instructions": [
    {
      "step": 1,
      "description": "Preheat oven to 350°F"
    }
  ],
  "cookTime": "30 minutes",
  "prepTime": "15 minutes",
  "servings": 8,
  "difficulty": "easy",
  "tags": ["dessert", "chocolate", "cake"],
  "imageUrl": "https://example.com/recipe-image.jpg",
  "originalUrl": "https://www.instagram.com/p/xyz123/"
}
```

### 2. Processing States

Track processing status:
- `pending` - Just received, queued for processing
- `processing` - Currently extracting data
- `completed` - Successfully processed
- `failed` - Failed to process

### 3. Database Schema

**push_tokens table:**
```sql
CREATE TABLE push_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  token TEXT NOT NULL,
  type VARCHAR(10) NOT NULL, -- 'expo', 'fcm', 'apns'
  platform VARCHAR(10) NOT NULL, -- 'ios', 'android'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, token)
);
```

**recipe_processing_jobs table:**
```sql
CREATE TABLE recipe_processing_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  original_url TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  recipe_id UUID REFERENCES recipes(id),
  error_message TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Push Notification Implementation

### 1. Send Notifications

When recipe processing is complete, send a push notification using Expo's Push API:

**Endpoint:** `https://exp.host/--/api/v2/push/send`

**Request Body:**
```json
{
  "to": "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]",
  "title": "Recipe Ready! 🍽️",
  "body": "Your recipe from social media has been processed successfully",
  "data": {
    "type": "recipe_processed",
    "recipeId": "uuid-recipe-id",
    "processingId": "uuid-processing-id"
  },
  "sound": "default",
  "badge": 1
}
```

### 2. Notification Types

**Success Notification:**
```json
{
  "title": "Recipe Ready! 🍽️",
  "body": "Your {recipe_title} is now available in your recipe collection",
  "data": {
    "type": "recipe_processed",
    "recipeId": "uuid-recipe-id",
    "status": "completed"
  }
}
```

**Failure Notification:**
```json
{
  "title": "Recipe Processing Failed 😔",
  "body": "We couldn't extract the recipe from that link. Please try a different URL",
  "data": {
    "type": "recipe_processed",
    "status": "failed",
    "error": "Unable to parse recipe content"
  }
}
```

## Technical Implementation Suggestions

### 1. Queue System

Use a background job queue (Redis + Bull, Sidekiq, Celery) to handle recipe processing:

```javascript
// Example with Bull Queue (Node.js)
const Queue = require('bull');
const recipeProcessingQueue = new Queue('recipe processing');

// Add job to queue
recipeProcessingQueue.add('process-recipe', {
  userId: 'user-id',
  url: 'https://instagram.com/p/xyz',
  processingId: 'processing-id'
});

// Process jobs
recipeProcessingQueue.process('process-recipe', async (job) => {
  const { userId, url, processingId } = job.data;
  
  try {
    // Extract recipe data
    const recipeData = await extractRecipeFromUrl(url);
    
    // Save to database
    const recipe = await createRecipe(userId, recipeData);
    
    // Send success notification
    await sendPushNotification(userId, {
      type: 'success',
      recipeId: recipe.id
    });
    
  } catch (error) {
    // Send failure notification
    await sendPushNotification(userId, {
      type: 'failure',
      error: error.message
    });
  }
});
```

### 2. Recipe Extraction Libraries

Consider using these libraries for extraction:
- **Python:** `recipe-scrapers`, `beautifulsoup4`
- **Node.js:** `recipe-scraper`, `cheerio`
- **AI-based:** OpenAI GPT API for complex content parsing

### 3. Rate Limiting

Implement rate limiting to prevent abuse:
- Max 5 processing requests per user per hour
- Global rate limit of 100 requests per minute

### 4. Error Handling

Handle common errors:
- Invalid URLs
- Private/protected content
- Rate limited by source platform
- Network timeouts
- Parsing failures

## Testing

### 1. Test URLs

Use these URLs for testing:
- Instagram: `https://www.instagram.com/p/[post-id]/`
- TikTok: `https://www.tiktok.com/@username/video/[video-id]`
- YouTube: `https://www.youtube.com/watch?v=[video-id]`
- AllRecipes: `https://www.allrecipes.com/recipe/[recipe-id]/`

### 2. Test Push Notifications

Use Expo's push tool for testing:
```bash
npx expo send-push-notification --token "ExponentPushToken[...]" --message "Test notification"
```

## Security Considerations

1. **Validate URLs** - Ensure only supported domains
2. **Rate Limiting** - Prevent abuse
3. **Authentication** - Verify user tokens
4. **Data Sanitization** - Clean extracted content
5. **HTTPS Only** - Secure all communications

## Monitoring

Track these metrics:
- Processing success/failure rates
- Average processing time
- Push notification delivery rates
- Popular source platforms
- Error types and frequencies 