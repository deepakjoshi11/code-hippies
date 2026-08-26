"use client";
import {
  createContext, useState, useContext, useRef, useEffect,
  type ReactNode, type MouseEvent, type ElementType,
} from "react";
import { cn } from "@/lib/utils";

const MouseEnterContext = createContext<[boolean, (v: boolean) => void] | undefined>(undefined);

export function CardContainer({
  children, className, containerClassName,
}: { children?: ReactNode; className?: string; containerClassName?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isMouseEntered, setIsMouseEntered] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / 22;
    const y = (e.clientY - top - height / 2) / 22;
    ref.current.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`;
  };

  const handleMouseLeave = () => {
    setIsMouseEntered(false);
    if (ref.current) ref.current.style.transform = "rotateY(0deg) rotateX(0deg)";
  };

  return (
    <MouseEnterContext.Provider value={[isMouseEntered, setIsMouseEntered]}>
      <div
        className={cn("flex items-center justify-center", containerClassName)}
        style={{ perspective: "1200px" }}
      >
        <div
          ref={ref}
          onMouseEnter={() => setIsMouseEntered(true)}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className={cn(
            "relative flex items-center justify-center transition-all duration-200 ease-linear",
            className
          )}
          style={{ transformStyle: "preserve-3d" }}
        >
          {children}
        </div>
      </div>
    </MouseEnterContext.Provider>
  );
}

export function CardBody({ children, className }: { children?: ReactNode; className?: string }) {
  return (
    <div
      className={cn("h-full w-full [transform-style:preserve-3d] *:[transform-style:preserve-3d]", className)}
    >
      {children}
    </div>
  );
}

export function CardItem({
  as: Tag = "div", children, className,
  translateX = 0, translateY = 0, translateZ = 0,
  rotateX = 0, rotateY = 0, rotateZ = 0,
  ...rest
}: {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  translateX?: number | string;
  translateY?: number | string;
  translateZ?: number | string;
  rotateX?: number | string;
  rotateY?: number | string;
  rotateZ?: number | string;
  [key: string]: unknown;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const ctx = useContext(MouseEnterContext);
  const isMouseEntered = ctx?.[0] ?? false;

  useEffect(() => {
    if (!ref.current) return;
    ref.current.style.transform = isMouseEntered
      ? `translateX(${translateX}px) translateY(${translateY}px) translateZ(${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`
      : `translateX(0px) translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)`;
  }, [isMouseEntered, translateX, translateY, translateZ, rotateX, rotateY, rotateZ]);

  return (
    <Tag ref={ref} className={cn("w-fit transition duration-200 ease-linear", className)} {...rest}>
      {children}
    </Tag>
  );
}
