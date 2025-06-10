Based on the implementation and documentation, here's what the **backend developer must do**:

## 1. **Set Up Database Tables**

```sql
-- Store push notification tokens
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

-- Track recipe processing jobs
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

## 2. **Implement Two Required Endpoints**

### **Store Push Token**

```javascript
// POST /users/:userId/push-token
app.post('/users/:userId/push-token', async (req, res) => {
  const { userId } = req.params;
  const { token, type, platform } = req.body;

  try {
    await db.query(
      `
      INSERT INTO push_tokens (user_id, token, type, platform) 
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (user_id, token) 
      DO UPDATE SET updated_at = NOW()
    `,
      [userId, token, type, platform]
    );

    res.json({ success: true, message: 'Push token stored successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to store push token' });
  }
});
```

### **Process Social Media Recipe**

```javascript
// POST /users/:userId/recipes/process-social
app.post('/users/:userId/recipes/process-social', async (req, res) => {
  const { userId } = req.params;
  const { url } = req.body;

  // Validate URL
  if (!isValidRecipeUrl(url)) {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  try {
    // Create processing job
    const jobResult = await db.query(
      `
      INSERT INTO recipe_processing_jobs (user_id, original_url) 
      VALUES ($1, $2) RETURNING id
    `,
      [userId, url]
    );

    const processingId = jobResult.rows[0].id;

    // Add to background queue
    await recipeProcessingQueue.add('process-recipe', {
      userId,
      url,
      processingId,
    });

    res.json({
      success: true,
      processingId,
      message: 'Recipe processing started',
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to start processing' });
  }
});
```

## 3. **Set Up Background Job Queue**

Install and configure a job queue (using Redis + Bull for Node.js):

```bash
npm install bull redis
```

```javascript
const Queue = require('bull');
const recipeProcessingQueue = new Queue('recipe processing', 'redis://127.0.0.1:6379');

// Process jobs
recipeProcessingQueue.process('process-recipe', async (job) => {
  const { userId, url, processingId } = job.data;

  try {
    // Update status to processing
    await updateJobStatus(processingId, 'processing');

    // Extract recipe data from URL
    const recipeData = await extractRecipeFromUrl(url);

    // Save recipe to database
    const recipe = await createRecipe(userId, recipeData);

    // Update job with success
    await updateJobStatus(processingId, 'completed', recipe.id);

    // Send success notification
    await sendPushNotification(userId, {
      title: 'Recipe Ready! 🍽️',
      body: `Your ${recipeData.title} is now available`,
      data: {
        type: 'recipe_processed',
        recipeId: recipe.id,
        status: 'completed',
      },
    });
  } catch (error) {
    console.error('Recipe processing failed:', error);

    // Update job with failure
    await updateJobStatus(processingId, 'failed', null, error.message);

    // Send failure notification
    await sendPushNotification(userId, {
      title: 'Recipe Processing Failed 😔',
      body: "We couldn't extract the recipe from that link",
      data: {
        type: 'recipe_processed',
        status: 'failed',
        error: error.message,
      },
    });
  }
});
```

## 4. **Implement Recipe Extraction**

Choose and implement a scraping solution:

### **Option A: Use existing library (Python)**

```python
# Install: pip install recipe-scrapers
from recipe_scrapers import scrape_me

def extract_recipe_from_url(url):
    scraper = scrape_me(url)
    return {
        'title': scraper.title(),
        'ingredients': scraper.ingredients(),
        'instructions': scraper.instructions(),
        'cook_time': scraper.total_time(),
        'servings': scraper.yields(),
        'image_url': scraper.image(),
        'original_url': url
    }
```

### **Option B: Custom implementation (Node.js)**

```javascript
const cheerio = require('cheerio');
const axios = require('axios');

async function extractRecipeFromUrl(url) {
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);

  // Look for JSON-LD structured data
  const scriptTags = $('script[type="application/ld+json"]');

  for (let i = 0; i < scriptTags.length; i++) {
    try {
      const jsonData = JSON.parse($(scriptTags[i]).html());
      if (jsonData['@type'] === 'Recipe') {
        return parseRecipeData(jsonData);
      }
    } catch (e) {
      continue;
    }
  }

  // Fallback to manual scraping
  return manualScrape($, url);
}
```

## 5. **Implement Push Notifications**

```javascript
async function sendPushNotification(userId, notification) {
  // Get user's push tokens
  const tokens = await db.query('SELECT token FROM push_tokens WHERE user_id = $1', [userId]);

  const messages = tokens.rows.map((row) => ({
    to: row.token,
    title: notification.title,
    body: notification.body,
    data: notification.data,
    sound: 'default',
  }));

  // Send to Expo Push API
  const response = await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(messages),
  });

  return response.json();
}
```

## 6. **Add URL Validation**

```javascript
function isValidRecipeUrl(url) {
  const allowedDomains = [
    'instagram.com',
    'tiktok.com',
    'youtube.com',
    'allrecipes.com',
    'food.com',
    'foodnetwork.com',
    'epicurious.com',
  ];

  try {
    const urlObj = new URL(url);
    return allowedDomains.some((domain) => urlObj.hostname.includes(domain));
  } catch {
    return false;
  }
}
```

## 7. **Add Rate Limiting**

```javascript
const rateLimit = require('express-rate-limit');

const recipeProcessingLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 requests per hour per user
  keyGenerator: (req) => req.params.userId,
  message: 'Too many processing requests, try again later',
});

app.use('/users/:userId/recipes/process-social', recipeProcessingLimit);
```

## 8. **Environment Variables**

```env
REDIS_URL=redis://localhost:6379
EXPO_ACCESS_TOKEN=your_expo_access_token
DATABASE_URL=postgresql://...
```

## **Priority Order:**

1. Set up database tables
2. Implement the two endpoints (even with dummy responses)
3. Set up job queue infrastructure
4. Implement basic recipe extraction
5. Add push notifications
6. Add rate limiting and validation
7. Improve extraction accuracy

This gives you a working system that the frontend can immediately integrate with!
