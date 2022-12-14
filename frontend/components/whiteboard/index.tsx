import { useRef, useEffect, useState, MutableRefObject } from "react";
import io from "socket.io-client";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";

const WhiteBoard = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null | undefined>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [presenter, setPresenter] = useState(true);
  const [img, setImg] = useState(null);
  const socket = io("http://localhost:8080", {
    reconnectionAttempts: Infinity,
    timeout: 10000,
    transports: ["websocket"],
    forceNew: true,
  });

  const colors = [
    "black",
    "brown",
    "red",
    "green",
    "blue",
    "yellow",
    "pink",
    "#999",
    "white",
  ];
  const sizes = ["5", "10", "15", "20"];
  const [current, setCurrent] = useState({
    color: "white",
    size: 5,
    x: 0,
    y: 0,
    xLive: 0,
    yLive: 0,
    isDrawing: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      canvas.width = window.innerWidth * 2;
      canvas.height = window.innerHeight * 2;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    }

    const context = canvas?.getContext("2d");

    if (context) {
      context.scale(2, 2);
      context.lineCap = "round";
      context.strokeStyle = current.color;
      context.lineWidth = current.size;
    }

    contextRef.current = context;

    const roomId = "abcdef123" || uuidv4();
    socket.emit("roomJoin", roomId);

    socket.on("whiteboard", (data) => setImg(data));
  }, []);

  useEffect(() => {
    const canvasImg = canvasRef.current?.toDataURL();
    setTimeout(() => socket.emit("whiteboard", canvasImg), 1000);
  }, [current]);

  const startDrawing = ({ nativeEvent }: any) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current!.strokeStyle = current.color;
    contextRef.current!.lineWidth = current.size;
    contextRef.current?.beginPath();
    contextRef.current?.moveTo(offsetX, offsetY);
    setIsDrawing(true);
    setCurrent({ ...current, x: offsetX, y: offsetY, isDrawing: true });
  };

  const finishDrawing = () => {
    contextRef.current?.closePath();
    setIsDrawing(false);
    setCurrent({ ...current, isDrawing: false });
  };

  const draw = ({ nativeEvent }: any) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;

    contextRef.current?.lineTo(offsetX, offsetY);
    contextRef.current?.stroke();
    setCurrent({ ...current, xLive: offsetX, yLive: offsetY });
  };

  const selectColor = (e: any) => {
    setCurrent({
      ...current,
      color: e.target.getAttribute("itemType"),
    });
  };

  const selectSize = (e: any) => {
    setCurrent({
      ...current,
      size: parseInt(e.target.getAttribute("itemType")),
    });
  };

  if (!presenter) {
    return (
      <div
        style={{ backgroundColor: "#242424", width: "100vw", height: "100vh" }}
      >
        <img
          src={img || ""}
          style={{ width: "100vw", height: "100vh" }}
          alt="You are watching the presenter now."
        />
      </div>
    );
  }

  return (
    <Container>
      <canvas
        onMouseDown={startDrawing}
        onMouseUp={finishDrawing}
        onMouseMove={draw}
        ref={canvasRef}
      />
      <ChatContainer>Chat section</ChatContainer>
      <Options>
        <ColorsContainer>
          {colors.map((color) => (
            <Color key={color} onClick={selectColor} itemType={color} />
          ))}
        </ColorsContainer>

        <SizesContainer>
          {sizes.map((size) => (
            <Size key={size} onClick={selectSize} itemType={size} />
          ))}
        </SizesContainer>
      </Options>
      <button onClick={() => setPresenter(false)}>Presenter</button>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  background-color: #242424;
`;

const ChatContainer = styled.div`
  position: absolute;
  height: 100vh;
  width: 12rem;
  top: 0;
  right: 0;
  background-color: lightblue;
`;

const ColorsContainer = styled.div``;

const Color = styled.div`
  width: 2rem;
  height: 2rem;
  background-color: ${({ itemType }) => itemType};
`;

const SizesContainer = styled.div`
  margin-top: 1rem;
`;

const Size = styled.div`
  width: ${({ itemType }: any) => `1.${itemType / 2.5}rem`};
  height: ${({ itemType }: any) => `1.${itemType / 2.5}rem`};
  border-radius: 50%;
  border: 1px solid #222222;
  background-color: white;
`;

const Options = styled.div`
  position: absolute;
  top: 2rem;
  left: 1rem;
`;

export default WhiteBoard;
