export type ChatFeature = {
  id: number;
  icon: React.ReactNode;
  label: string;
  description: string;
};

export type Message = {
  id: number;
  message: string;
  isUser: boolean;
};
