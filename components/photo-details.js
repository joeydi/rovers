import { useEffect } from "react";

export default function PhotoDetails({ photo, setActivePhoto }) {
    useEffect(() => {
        function handleKeyPress(e) {
            if (e.key === "Escape") {
                setActivePhoto(null);
            }
        }

        window.addEventListener("keydown", handleKeyPress);

        return () => {
            window.removeEventListener("keydown", handleKeyPress);
        };
    }, [setActivePhoto]);

    return (
        <div className="photo-details-wrap">
            <div className="photo-details">
                <div className="photo">
                    <img src={photo.img_src} alt="" loading="lazy" />
                </div>
                <div className="details">
                    <h2>{photo.id}</h2>
                    <p>
                        <strong>Rover</strong>
                        <span>{photo.rover.name}</span>
                    </p>
                    <p>
                        <strong>Camera</strong>
                        <span>{photo.camera.full_name}</span>
                    </p>
                    <p>
                        <strong>Date</strong>
                        <span>{photo.earth_date}</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
