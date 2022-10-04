import type { NextPage } from "next";
import Link from "next/link";

import Data from "../../Data.json";

interface RoomType {
  id: number;
  title: string;
  description: string;
}

const Rooms: NextPage = () => {
  return (
    <main>
      <h2>Active Rooms</h2>
      <ul>
        {Data.map((room) => (
          <li key={room.id}>
            <Link href={`./rooms/${room.id}`}>
              <h3>{room.title}</h3>
            </Link>
            <p>{room.description}</p>
          </li>
        ))}
      </ul>
    </main>
  );
};

export default Rooms;
