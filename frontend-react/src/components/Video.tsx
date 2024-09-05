import * as React from 'react';

interface VideoProps {}

const Video: React.FC<VideoProps> = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <video id="bg-video" style={{ width: "100%" }}>
        <source src="ZoePerfect.mp4" type="video/mp4" />
      </video>

      {/* Add another video using the ::before pseudo-element */}
      <div style={{ position: "absolute", top: 0, left: 0, width: "50%", height: "50%", zIndex: -1 }}>
        <video id="bg2-video" autoPlay loop muted>
          <source src="Alien.mp4" type="video/mp4" />
        </video>
      </div>
    </div>
  );
};

export default Video;