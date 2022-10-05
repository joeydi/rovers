import gsap from "gsap";
import { useEffect, useRef } from "react";

export default function ManifestScrubber({ manifest, handleSolChange }) {
    const photoCounts = manifest.photos.map((item) => item.total_photos);
    const maxPhotoCount = Math.max(...photoCounts);

    const scrubberRef = useRef();
    const timelineRef = useRef();

    useEffect(() => {
        let timelineClientX;

        const mouseEnterHandler = (e) => {
            console.log("mouseEnterHandler");
            timelineClientX = e.target.getBoundingClientRect().x;
            // console.log({ timelineClientX });
        };

        const mouseMoveHandler = (e) => {
            // console.log(e);
            const offsetX = e.clientX - timelineClientX;
            // console.log({ offsetX });
            const wrapperWidth = e.target.clientWidth;
            const timelineWidth = timelineRef.current.scrollWidth;
            const timelineOverflow = timelineWidth - wrapperWidth;

            const hoverPosition = gsap.utils.mapRange(0, e.target.clientWidth, 0, 1, offsetX);
            const translateX = hoverPosition * timelineOverflow;

            timelineRef.current.style.transform = `translateX(${-translateX}px)`;
        };

        scrubberRef.current.addEventListener("mouseenter", mouseEnterHandler);
        scrubberRef.current.addEventListener("mousemove", mouseMoveHandler);
    }, []);

    return (
        <div className="manifest-scrubber" ref={scrubberRef}>
            <div className="manifest-scrubber-timeline" ref={timelineRef}>
                {manifest.photos.map((item) => {
                    return (
                        <button key={item.sol} className="manifest-scrubber-sol">
                            <div style={{ transform: `scaleY(${item.total_photos / maxPhotoCount})` }}>
                                <span>{item.sol}</span>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
