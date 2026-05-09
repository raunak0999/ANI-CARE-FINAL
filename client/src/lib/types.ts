export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface ChatMessageType {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}
