import { Recipe } from "./recipe";

export type ChatMessage = {
  role: 'USER';
  content: string;
} | {
  role: 'ASSISTANT';
  content: AssistantMessageContent;
}

export type AssistantMessageContent = {
  messageType: 'TEXT';
  message: string;
} | {
  messageType: 'RECIPE_DETAILS';
  recipe: Recipe;
} | {
  messageType: 'GALLERY';
  gallery: GalleryItem[];
} | {
  messageType: 'JOB_STATUS';
  jobStatus: JobStatus;
}

export interface GalleryItem {
  id: string;
  imageUrl: string;
  title: string;
  description?: string;
}

export type JobStatus = {
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
