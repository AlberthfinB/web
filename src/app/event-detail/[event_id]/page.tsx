"use client"
import EventDetail from "@/view/pages/event-detail/component";
import { usePathname } from "next/navigation";


export default function EventDet () { 
    const router = usePathname();
    const param = router.replace('/event-detail/', '');
    return (<EventDetail event_id  = {param}/>)
}

