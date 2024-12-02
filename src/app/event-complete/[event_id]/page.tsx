"use client"
import EventCompleted from "@/view/pages/event-completed/component/event-comp"
import { usePathname } from "next/navigation";

export default function EventDet() {
    const router = usePathname();
    const param = router.replace('/event-complete/', '');
    return (<EventCompleted event_id={param} />)
}
