export interface IEventDetails {
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
}

export interface EventDetailProps {
    event_id: string;
}