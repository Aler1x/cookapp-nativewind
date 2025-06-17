import { Job } from "./profile";
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
  message: string;
  recipe: Recipe;
} | {
  messageType: 'GALLERY';
  message: string;
  recipes: Recipe[];
} | {
  messageType: 'JOB_STATUS';
  message: string;
  jobInfo: Job;
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
