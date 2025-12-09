import { EventImageData } from "@/src/modules/business/types/event";

export const EVENT_IMAGE_FRAME_HEIGHT = 160;

export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export const getImageMetrics = (
  image: EventImageData,
  frameWidth: number,
  frameHeight: number
) => {
  const scaledHeight = frameWidth * (image.height / image.width || 1);
  const minOffset = Math.min(0, frameHeight - scaledHeight);
  return { scaledHeight, minOffset };
};
