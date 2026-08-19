import type { Dispatch, SetStateAction } from "react";
import Lightbox from "react-18-image-lightbox";

type ImagePopupProps = {
  images: string[];
  setIsOpen: (isOpen: boolean) => void;
  photoIndex: number;
  setPhotoIndex: Dispatch<SetStateAction<number>>;
};

const ImagePopup = ({
  images,
  setIsOpen,
  photoIndex,
  setPhotoIndex,
}: ImagePopupProps) => {
  if (images.length === 0) {
    return null;
  }

  return (
    <Lightbox
      mainSrc={images[photoIndex]}
      nextSrc={images[(photoIndex + 1) % images.length]}
      prevSrc={images[(photoIndex + images.length - 1) % images.length]}
      onCloseRequest={() => setIsOpen(false)}
      onMovePrevRequest={() =>
        setPhotoIndex((currentIndex) =>
          (currentIndex + images.length - 1) % images.length,
        )
      }
      onMoveNextRequest={() =>
        setPhotoIndex((currentIndex) => (currentIndex + 1) % images.length)
      }
    />
  );
};

export default ImagePopup;

