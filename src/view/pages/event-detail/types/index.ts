export interface IPromotion {
    discount: number;
    max_uses: number;
    valid_until: string;
    promotion_type_id:number
  }
  
export  interface IEventDetail {
    name_event: string;
    image_event: string;
    description: string;
    event_expired: string;
    location: string;
    seats: number;
    ticket_price: number;
    promo_event: string;
    available_seats: number;
    promotion_type_id: number;
    Promotion: IPromotion;
  }
 export interface EventDetailProps {
    event_id: string;
  }
  
export  interface IUser {
    name: string;
    email: string;
    role: string;
    user_id: number;
  }