export interface ChatMessage {
  role: 'USER' | 'ASSISTANT';
  content: string | AssistantMessageContent;
}

export interface AssistantMessageContent {
  messageType: 'TEXT' | 'GALLERY' | 'RECIPE_DETAILS' | 'JOB_STATUS';
  message: string;
  recipes?: Recipe[];
  gallery?: GalleryItem[];
  jobStatus?: JobStatus;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  prepTime?: number;
  cookTime?: number;
  servings?: number;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  ingredients?: string[];
  instructions?: string[];
}

export interface GalleryItem {
  id: string;
  imageUrl: string;
  title: string;
  description?: string;
}

export interface JobStatus {
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  progress?: number;
  message?: string;
}

export interface ChatRequest {
  chatId?: string;
  request: string;
}

export interface ChatResponse {
  chatId: string;
  userId: string;
  messages: ChatMessage[];
  updatedAt: string;
}

export interface ChatHistoryItem {
  chatId: string;
  userId: string;
  updatedAt: string;
}

export interface StreamChunk {
  content: string;
  isComplete: boolean;
}

