import React, { useEffect, useMemo, useRef, useState } from "react";
import Image, { ImageProps } from "next/image";
import Link from "next/link";
import { RoughNotation, RoughNotationProps } from "react-rough-notation";
import styles from "./[MdxComponents].module.css";
import Twemoji from "react-twemoji";
// recoil Import
import { headerState } from "@/lib/atoms";
import { useRecoilState } from "recoil";

/* 인터페이스 커스텀 타입 확장 */
interface NotationProps extends Omit<RoughNotationProps, "children"> {
  className?: string;
  children?: React.ReactNode;
}
interface HeadersType {
  isIntersecting?: boolean;
  target: { id: string; element?: HTMLHeadingElement };
}
interface LinkProps extends React.HTMLProps<HTMLAnchorElement> {
  text: string;
  href: string;
}

export const Lnk = (props: LinkProps) => {
  return (
    <Link
      href={props.href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-paleBlue"
    >
      {props.text}
    </Link>
  );
};

// NextImage
export const Img = ({ ...props }: ImageProps) => {
  return (
    <Image
      {...props}
      width={1000}
      height={1000}
      quality={100}
      className="m-auto mt-8 mb-3 h-fit w-fit rounded-xl drop-shadow-xl"
      alt="이미지"
    />
  );
};

// Youtube
export const Youtube = ({ src }: { src: string }) => {
  return (
    <div className="relative mb-8 pb-[76.25%] pt-6 md:right-[27.3%] md:w-screen md:max-w-3xl">
      <iframe
        className="absolute top-0 left-0 h-full w-full rounded-2xl bg-black shadow-2xl shadow-black dark:shadow-red-900/30 "
        width="560"
        height="315"
        src={src}
        frameBorder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

// RoughNotation
export const Note = (props: NotationProps) => {
  const [isCalled, setIsCalled] = useState(false);
  useEffect(() => {
    setIsCalled(true);
    return () => setIsCalled(false);
  }, []);
  return (
    <RoughNotation show={isCalled} color="tomato" animationDuration={1200} {...props}>
      {props.children}
    </RoughNotation>
  );
};

export const H3 = ({ children }: { children?: React.ReactNode }) => {
  const getAnchor = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z가-힣0-9 ]/g, "")
      .replace(/[ ]/g, "-");
  };
  const anchor = getAnchor(children as string);
  const link = `#${anchor}`;

  const [, setHeaders] = useRecoilState(headerState);
  useEffect(() => {
    setHeaders(prev => [...prev, link]);
    return () => setHeaders([]);
  }, [link, setHeaders]);

  return (
    <h3 id={anchor}>
      <Twemoji
        options={{
          className:
            "inline cursor-fancyHover m-px sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 align-text-17",
        }}
      >
        <a className="anchor-link no-underline" href={link}>
          💡&nbsp;
        </a>
        {children}
      </Twemoji>
    </h3>
  );
};

export const HeadingNavigator = () => {
  const { Img } = MdxComponents;
  const [isClick, setIsClick] = useState(true);
  const [activeId, setActiveId] = useState("");
  const [headers] = useRecoilState(headerState);
  const pinColor = ["blue", "green", "orange"];
  const pickColor = useMemo(
    () => Math.floor(Math.random() * pinColor.length),
    [pinColor.length],
  );

  const useIntersectionObserver = (
    setActiveId: React.Dispatch<React.SetStateAction<string>>,
  ) => {
    const headingElementsRef = useRef<{
      [key: string]: HeadersType;
    }>({});

    useEffect(() => {
      const navigator = <T extends IntersectionObserverEntry>(data: Array<T>) => {
        headingElementsRef.current = data.reduce(
          (
            map: { [key: string]: { target: { id: string } } },
            headingElement: { target: { id: string } },
          ) => {
            map[headingElement.target.id] = headingElement;
            return map;
          },
          headingElementsRef.current,
        );

        const visibleHeadings: HeadersType[] = [];
        Object.keys(headingElementsRef.current).forEach(key => {
          const headingElement = headingElementsRef.current[key];
          if (headingElement.isIntersecting) visibleHeadings.push(headingElement);
        });

        const getIndexFromId = (id: string) =>
          headingElements.findIndex(heading => heading.id === id);

        if (visibleHeadings.length === 1) setActiveId(visibleHeadings[0].target.id);
        else if (visibleHeadings.length > 1) {
          const sortedVisibleHeadings = visibleHeadings.sort((a, b) => {
            if (getIndexFromId(a.target.id) > getIndexFromId(b.target.id)) return 1;
            else return 0;
          });
          setActiveId(sortedVisibleHeadings[0].target.id);
        }
      };

      const observer = new IntersectionObserver(navigator, {
        rootMargin: "-50px 0px -50%",
      });
      const headingElements = Array.from(document.querySelectorAll("h3"));
      headingElements.forEach(element => observer.observe(element));
      return () => {
        observer.disconnect();
      };
    }, [setActiveId]);
  };
  useIntersectionObserver(setActiveId);

  return (
    <div
      className={`fixed font-heading duration-500 ease-out sm:hidden lg:block ${
        isClick
          ? "top-1/4 w-48 opacity-100 lg:right-12 xl:right-[10%]"
          : "top-0 right-0 w-5 opacity-30"
      }`}
    >
      <div className={`${isClick ? styles.notepad_heading : "bg-transparent"}`}>
        <Img
          onClick={() => setIsClick(!isClick)}
          className="m-auto h-5 w-5 cursor-fancyHover transition hover:scale-110"
          src={`/images/2022/pinColor/pin-${pinColor[pickColor]}@2x.png`}
          alt={"image"}
        />
      </div>
      <div className={`${isClick ? "opacity-100" : "opacity-0"}`}>
        <div className={styles.notepad}>
          {headers.map((header, i) => {
            const Heading = header.replace(/[#]/g, " ").replace(/[-]/g, " ");
            return (
              <div key={i}>
                <div
                  className={`absolute left-0 duration-300 ${
                    header === `#${activeId}` ? "blue-dot" : "white-dot"
                  }`}
                ></div>
                <a
                  href={header}
                  className={`duration-300 ${
                    header === `#${activeId}`
                      ? "scale-125 opacity-100"
                      : "scale-100 opacity-30"
                  }`}
                >
                  {Heading}
                </a>
                <br />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const MdxComponents = {
  Img,
  Lnk,
  Youtube,
  Note,
  HeadingNavigator,
};

export default MdxComponents;
