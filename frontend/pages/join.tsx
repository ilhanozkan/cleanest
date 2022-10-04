import type { NextPage } from "next";

const Rooms: NextPage = () => {
  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log("join room");
  };

  return (
    <main>
      <h2>Join room</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="#" />
      </form>
    </main>
  );
};

export default Rooms;
