"use client";

import {
  ArrowCircleLeft,
  ArrowCircleLeftOutlined,
  ArrowCircleRight,
  ArrowCircleRightOutlined,
} from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { useSwiper } from "swiper/react";

export const SwiperNavigationButtons = ({
  dataLength,
}: {
  dataLength: number;
}) => {
  const swiper = useSwiper();
  const [isEnd, setIsEnd] = useState(swiper.isEnd);
  const [isBeginning, setIsBeginning] = useState(swiper.isBeginning);

  useEffect(() => {
    swiper.on("activeIndexChange", () => {
      setIsEnd(swiper.isEnd);
      setIsBeginning(swiper.isBeginning);
    });
    swiper.on("slidesLengthChange", () => {
      setIsEnd(false);
    });
    return () => {
      swiper.off("activeIndexChange");
      swiper.off("slidesLengthChange");
    };
  }, [swiper, dataLength]);

  return (
    <Box
      sx={{
        marginTop: 5,
        display: "flex",
        justifyContent: "flex-end",
        width: "100%",
        height: 40,
      }}
    >
      <IconButton sx={{ p: 0 }} onClick={() => swiper.slidePrev()}>
        {isBeginning ? (
          <ArrowCircleLeftOutlined
            sx={{ width: 40, height: 40 }}
            color="primary"
          />
        ) : (
          <ArrowCircleLeft sx={{ width: 40, height: 40 }} color="primary" />
        )}
      </IconButton>
      <IconButton sx={{ p: 0 }} onClick={() => swiper.slideNext()}>
        {isEnd ? (
          <ArrowCircleRightOutlined
            sx={{ width: 40, height: 40 }}
            color="primary"
          />
        ) : (
          <ArrowCircleRight sx={{ width: 40, height: 40 }} color="primary" />
        )}
      </IconButton>
    </Box>
  );
};
