import type { NextPage } from "next";
import { useRouter } from "next/router";

const LogIn: NextPage = () => {
  const router = useRouter();
  const { room } = router.query;

  return <h2>Room #{room}</h2>;
};

export default LogIn;
