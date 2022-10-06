import gsap from "gsap";
import { useEffect, useRef } from "react";

export default function ManifestScrubber({ manifest, setActiveSol }) {
    const photoCounts = manifest.photos.map((item) => item.total_photos);
    const maxPhotoCount = Math.max(...photoCounts);

    const scrubberRef = useRef();
    const timelineRef = useRef();

    useEffect(() => {
        let timelineClientX;

        const mouseEnterHandler = (e) => {
            timelineClientX = e.target.getBoundingClientRect().x;
        };

        const mouseMoveHandler = (e) => {
            const offsetX = e.clientX - timelineClientX;
            const wrapperWidth = scrubberRef.current.clientWidth;
            const timelineWidth = timelineRef.current.scrollWidth;
            const timelineOverflow = timelineWidth - wrapperWidth;

            const hoverPosition = gsap.utils.clamp(0, 1, gsap.utils.mapRange(0, wrapperWidth, 0, 1, offsetX));
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
                    const height = Math.ceil((item.total_photos / maxPhotoCount) * 100);

                    return (
                        <button key={item.sol} className="manifest-scrubber-sol" onClick={() => setActiveSol(item.sol)}>
                            <div style={{ height: `${height}px` }}>
                                <span>{item.sol}</span>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
