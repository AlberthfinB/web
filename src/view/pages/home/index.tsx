
import EventComplete from "./components/event-completed";
import EventList from "./components/event-list";

export default function HomeView() {
  return (
    <div>
      <div>
        <EventList />
        <hr/>
        <EventComplete />
      </div>
    </div>
  );
}
