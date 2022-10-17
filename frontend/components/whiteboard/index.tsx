import { useRef, useEffect, useState, MutableRefObject } from "react";
import io from "socket.io-client";
import styled from "styled-components";

const WhiteBoard = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null | undefined>(null);
  const [isDrawing, setIsDrawing] = useState(false);

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
    color: "black",
    size: 5,
    x: 0,
    y: 0,
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
  }, []);

  const startDrawing = ({ nativeEvent }: any) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current!.strokeStyle = current.color;
    contextRef.current!.lineWidth = current.size;
    contextRef.current?.beginPath();
    contextRef.current?.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const finishDrawing = () => {
    contextRef.current?.closePath();
    setIsDrawing(false);
  };

  const draw = ({ nativeEvent }: any) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current?.lineTo(offsetX, offsetY);
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