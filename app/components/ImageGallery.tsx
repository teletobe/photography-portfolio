"use client";
import { useRef } from "react";
import Image from "next/image";
import Masonry from "react-masonry-css";

import type { LightGallery } from "lightgallery/lightgallery";
import LightGalleryComponent from "lightgallery/react";
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";

interface Props {
  images: any[];
  breakpointCols: number;
  isRemainingLoading?: boolean;
}

export default function ImageGallery({
  images,
  breakpointCols,
  isRemainingLoading,
}: Props) {
  const lightboxRef = useRef<LightGallery | null>(null);

  return (
    <>
      <Masonry
        breakpointCols={breakpointCols}
        className="flex gap-2"
        columnClassName=""
      >
        {images.map((image, index) => (
          <Image
            key={index}
            src={image}
            alt="placeholder"
            className="my-2 hover:opacity-95 cursor-pointer"
            placeholder="blur"
            loading="lazy"
            onClick={() => {
              lightboxRef.current?.openGallery(index);
            }}
          />
        ))}
      </Masonry>
      {isRemainingLoading && (
        <div className="flex justify-center py-4">
          <p>Loading more images...</p>
        </div>
      )}
      <LightGalleryComponent
        onInit={(ref) => {
          if (ref) {
            lightboxRef.current = ref.instance;
          }
        }}
        speed={500}
        plugins={[lgThumbnail, lgZoom]}
        dynamic
        dynamicEl={images.map((image) => ({
          src:
            typeof image === "string"
              ? image
              : (image as { src: string }).src,
          thumb:
            typeof image === "string"
              ? image
              : (image as { src: string }).src,
        }))}
      />
    </>
  );
}
