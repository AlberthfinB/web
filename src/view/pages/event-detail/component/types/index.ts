export interface IEventDetail {
    name_event: string;
    image_event: string;
    description: string;
    event_expired: string;
    location: string;
    seats: number;
    ticket_price: number;
    promo_event: string;
  }
export  interface EventDetailProps {
    event_id: string;
  }