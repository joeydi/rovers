import { useMemo, useEffect, useState } from "react";
import debounce from "underscore/modules/debounce.js";

export default function RoverPhotos({ rover, manifest, setActivePhoto }) {
    const [activeSol, setActiveSol] = useState(1);
    const [debouncedSol, setDebouncedSol] = useState(1);
    const [activeCamera, setActiveCamera] = useState();
    const [photos, setPhotos] = useState([]);

    const searchParams = new URLSearchParams();
    debouncedSol && searchParams.set("sol", debouncedSol);
    activeCamera && searchParams.set("camera", activeCamera);

    const endpoint = `https://mars-photos.herokuapp.com/api/v1/rovers/${rover.slug}/photos?${searchParams.toString()}`;

    const fetchPhotos = function () {
        fetch(endpoint)
            .then((response) => response.json())
            .then((data) => {
                setPhotos(data.photos);
            });
    };

    useEffect(fetchPhotos, [debouncedSol, activeCamera, endpoint]);

    const handleSolChange = function (e) {
        setActiveSol(e.target.value);
        debouncedSolChangeHandler(e);
    };

    const debouncedSolChangeHandler = useMemo(
        () =>
            debounce(function (e) {
                setDebouncedSol(e.target.value);
            }, 500),
        []
    );

    const handleCameraChange = function (e) {
        setActiveCamera(e.target.value);
    };

    return (
        <div className="rover-photos">
            <div className="sol-select">
                <span>Sol {activeSol}</span>
                <input type="range" min="1" max={manifest.max_sol} step="1" onChange={handleSolChange} />
            </div>
            <div className="camera-select">
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
            </div>
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
