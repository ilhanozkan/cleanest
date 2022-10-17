import type { NextPage } from "next";
import Link from "next/link";
import { useRef } from "react";
import styled from "styled-components";

import Data from "../../Data.json";

const Suffix = styled.span`
  font-weight: 600;
  color: rgb(39, 46, 255);
`;

interface RoomType {
  id: number;
  title: string;
  description: string;
}

const Rooms: NextPage = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = () => {
    inputRef.current?.focus();
  };

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
      <div>
        <p onClick={handleFocus}>
          Let's create a <Suffix>room.</Suffix>
        </p>
        <input ref={inputRef} />
      </div>
    </main>
  );
};

export default Rooms;
