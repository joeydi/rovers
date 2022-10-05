import { useEffect } from "react";

export default function PhotoDetails({ photo, setActivePhoto }) {
    console.log(photo);

    useEffect(() => {
        function handleKeyPress(e) {
            if (e.key === "Escape") {
                setActivePhoto(null);
            }
        }

        window.addEventListener("keyup", handleKeyPress);

        return () => {
            window.removeEventListener("keyup", handleKeyPress);
        };
    }, []);

    return (
        <div className="photo-details-wrap">
            <div className="photo-details">
                <div className="photo">
                    <img src={photo.img_src} alt="" loading="lazy" />
                </div>
                <div className="details">
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
