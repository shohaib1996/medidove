import ModalVideo from "react-modal-video";

type VideoPopupProps = {
  isVideoOpen: boolean;
  setIsVideoOpen: (isOpen: boolean) => void;
  videoId?: string;
};

const VideoPopup = ({
  isVideoOpen,
  setIsVideoOpen,
  videoId = "bgMEvrd2E",
}: VideoPopupProps) => (
  <ModalVideo
    channel="youtube"
    isOpen={isVideoOpen}
    videoId={videoId}
    onClose={() => setIsVideoOpen(false)}
  />
);

export default VideoPopup;
