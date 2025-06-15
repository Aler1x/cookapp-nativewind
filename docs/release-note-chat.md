# Cats CookApp — Release Notes

## 1 Chat API

Ну логічно що чати є

| Verb & Path             | Опис                                         |
| ----------------------- | -------------------------------------------- |
| **POST** `/chat`        | Звичайний запит до LLM                       |
| **POST** `/chat/stream` | Те саме, але SSE-стрім (`text/event-stream`) |

### 1.1 Request body

```jsonc
{
  "chatId": "string", // optional — якщо є, продовжуємо діалог
  "request": "string", // текст користувача
}
```

### 1.2 Sync response (/chat)

```
{
  "chatId": "f17618f1-4c97-4465-8bc6-cde5c366ccd1",
  "userId": "user_2wxjho5cvh50WInrs6oyqGUJSTF",
  "messages": [
    {
      "role": "ASSISTANT",
      "content": {
        "messageType": "TEXT",          // TEXT | GALLERY | RECIPE_DETAILS | JOB_STATUS
        "message": "Welcome! How can I assist you with cooking or recipes today?"
      }
    }
  ],
  "updatedAt": "2025-06-14T19:31:44.081620248"
}
```

### 1.3 Stream response (/chat/stream)

`messages[0].content приходить частинами — потрібно конкатенувати на FE.`

Решта полів збігаються з sync-варіантом.

Примітка: проміжні тул-коли не повертаються — одразу готовий об’єкт.

### 2 Chat History API

| Verb & Path                | Опис                                                  |
| -------------------------- | ----------------------------------------------------- |
| GET /chat-history          | Список діалогів користувача                           |
| GET /chat-history/{chatId} | Повна історія конкретного діалогу                     |
| GET /chat-history/initial  | Генерує новий chatId і повертає стартове повідомлення |

### 2.1 Список чатів

```
[
  {
    "chatId": "960c1100-0cec-4773-a585-7e1825c85ef7",
    "userId": "user_2wxjho5cvh50WInrs6oyqGUJSTF",
    "updatedAt": "2025-06-14T20:24:24.820774"
  }
]
```

### 2.2 Повна історія

```
{
  "chatId": "310cf276-2861-46ab-8a40-f37607f3ce94",
  "userId": "user_2wxjho5cvh50WInrs6oyqGUJSTF",
  "messages": [
    { "role": "USER", "content": "hi" },
    {
      "role": "ASSISTANT",
      "content": {
        "messageType": "TEXT",
        "message": "Hello! How can I assist you with cooking today? …"
      }
    }
  ],
  "updatedAt": "2025-06-14T19:34:45.947723"
}
```

### 2.3 Initial chat

```
{
  "chatId": "bc49b5ba-461e-42d2-ad60-25facfe03d8f",
  "userId": "user_2wxjho5cvh50WInrs6oyqGUJSTF",
  "messages": [
    {
      "role": "ASSISTANT",
      "content": {
        "messageType": "TEXT",
        "message": "Hello! I'm your AI-powered cooking assistant. …"
      }
    }
  ],
  "updatedAt": "2025-06-14T19:46:10.800837144"
}
```

3 Відомі обмеження
Streaming: великий обєкт body і лише потрібне messages[0].content поле для конкатенації
(Подумаю над оптимізацією пізніше.)
