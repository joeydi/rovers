import { useMemo, useEffect, useState } from "react";
import debounce from "underscore/modules/debounce.js";
import ManifestScrubber from "./manifest-scrubber";

export default function RoverPhotos({ rover, manifest, activePhoto, setActivePhoto }) {
    const [activeSol, setActiveSol] = useState(manifest.photos[0].sol);
    const [activeCamera, setActiveCamera] = useState();
    const [photos, setPhotos] = useState([]);

    const searchParams = new URLSearchParams();
    searchParams.set("sol", activeSol);
    activeCamera && searchParams.set("camera", activeCamera);

    const endpoint = `https://mars-photos.herokuapp.com/api/v1/rovers/${rover.slug}/photos?${searchParams.toString()}`;

    const fetchPhotos = function () {
        fetch(endpoint)
            .then((response) => response.json())
            .then((data) => {
                setPhotos(data.photos);
            });
    };

    useEffect(fetchPhotos, [activeSol, activeCamera, endpoint]);

    const handleCameraChange = function (e) {
        setActiveCamera(e.target.value);
    };

    useEffect(() => {
        function handleKeyPress(e) {
            if (!activePhoto) {
                return;
            }

            const activePhotoIndex = photos.findIndex((photo) => {
                return photo.id === activePhoto.id;
            });

            if (e.key === "ArrowLeft" && activePhotoIndex > 0) {
                setActivePhoto(photos[activePhotoIndex - 1]);
            }

            if (e.key === "ArrowRight" && activePhotoIndex < photos.length - 1) {
                setActivePhoto(photos[activePhotoIndex + 1]);
            }
        }

        window.addEventListener("keydown", handleKeyPress);

        return () => {
            window.removeEventListener("keydown", handleKeyPress);
        };
    }, [photos, activePhoto, setActivePhoto]);

    return (
        <div className="rover-photos">
            <div className="sol-select">
                <h2>Sol {activeSol}</h2>
                <ManifestScrubber {...{ manifest, setActiveSol }} />
            </div>
            {/* <div className="camera-select">
                <span>Camera</span>
                <div className="checkbox-pills">
                    <div className="checkbox">
                        <input id="all" type="checkbox" name="camera" value="" checked={!activeCamera} onChange={handleCameraChange} />
                        <label htmlFor="all">All</label>
                    </div>
                    {rover.cameras.map((camera) => {
                        return (
                            <div key={camera} className="checkbox">
                                <input id={camera} type="checkbox" name="camera" value={camera} checked={camera === activeCamera} onChange={handleCameraChange} />
                                <label htmlFor={camera}>{camera}</label>
                            </div>
                        );
                    })}
                </div>
            </div> */}
            <div className="rover-photos-grid">
                {photos.map((photo) => (
                    <div
                        key={photo.id}
                        className="photo"
                        onClick={() => {
                            setActivePhoto(photo);
                        }}>
                        <img src={photo.img_src} alt="" loading="lazy" />
                    </div>
                ))}
            </div>
        </div>
    );
}
