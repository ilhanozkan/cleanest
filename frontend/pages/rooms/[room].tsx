import type { NextPage } from "next";
import { useRouter } from "next/router";

import Whiteboard from "../../components/whiteboard";

const Room: NextPage = () => {
  const router = useRouter();
  const { room } = router.query;

  return (
    <main>
      <h2>Room #{room}</h2>
      <Whiteboard />
    </main>
  );
};

export default Room;
