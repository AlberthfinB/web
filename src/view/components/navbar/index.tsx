"use client";
import { useRouter } from "next/navigation";

export default function NavbarMenu() {
  const router = useRouter();

  const handleLogin = async () => {
    router.push(`/login`);
  };
  
  const handleEvent = async () => {
    router.push(`/create-event`);
  };

  const handleMain = async () => {
    router.push(`/`);
  };

  return (
    <div className="navbar">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl" onClick={handleMain}>Mini Project</a>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <div className="font-bold" onClick={handleEvent}>
              Create Event
            </div>
          </li>
          <li>
            <div className="font-bold" onClick={handleLogin}>
              Log In
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
