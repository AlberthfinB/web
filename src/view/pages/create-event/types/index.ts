export interface ICategoryEvent {
    event_category_id: number;
    event_category_name: string;
  }
  
export  interface ITicketType {
    ticket_id: number;
    ticket_type: string;
  }
  
export  interface IPromotionType {
    promotion_type_id: number;
    promotion_type: string;
  }
  
export  interface IFormData {
    name_event: string;
    location: string;
    description: string;
    image_event: File | null;
    ticket_price: string;
    promo_event: string;
    seats: string;
    event_expired: string;
    ticket_id: string;
    event_category_id: string;
    promo_valid_date: string;
    promo_quota: string;
    discount: string;
  }