import { useRef, useEffect, useState, MutableRefObject } from "react";
import io from "socket.io-client";
import styled from "styled-components";

const WhiteBoard = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null | undefined>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const socket = io("http://localhost:8080");

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
    socket.off("whiteboard").on("whiteboard", (data) => {
      drawLive(data);
    });
  }, []);

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

    socket.emit("whiteboard", current);
  };

  const drawLive = (current: any) => {
    console.log("draw");
    const { color, size, x, y, xLive, yLive, isDrawing } = current;

    if (!isDrawing) finishDrawing();
    contextRef.current!.strokeStyle = color;
    contextRef.current!.lineWidth = size;
    contextRef.current?.beginPath();
    contextRef.current?.moveTo(x, y);
    contextRef.current?.lineTo(xLive, yLive);
    contextRef.current?.stroke();
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

  return (
    <Container>
      <canvas
        onMouseDown={startDrawing}
        onMouseUp={finishDrawing}
        onMouseMove={draw}
        ref={canvasRef}
      />

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
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  background-color: #242424;
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
