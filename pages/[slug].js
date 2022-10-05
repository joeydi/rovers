import { useCallback, useEffect, useState } from "react";
import Image from "next/future/image";
import debounce from "underscore/modules/debounce.js";

import { rovers } from "../data/rovers.js";

export default function RoverDetails({ rover, manifest }) {
    const manifestFields = [
        // { name: "Name", key: "name" },
        { name: "Launch Date", key: "launch_date" },
        { name: "Landing Date", key: "landing_date" },
        { name: "Max Date", key: "max_date" },
        { name: "Max Sol", key: "max_sol" },
        // { name: "Status", key: "status" },
        { name: "Total Photos", key: "total_photos" },
    ];

    const [activeSol, setActiveSol] = useState(1);
    const [activeCamera, setActiveCamera] = useState();
    const [photos, setPhotos] = useState([]);

    const searchParams = new URLSearchParams();
    activeSol && searchParams.set("sol", activeSol);
    activeCamera && searchParams.set("camera", activeCamera);

    const endpoint = `https://mars-photos.herokuapp.com/api/v1/rovers/${rover.slug}/photos?${searchParams.toString()}`;

    useEffect(() => {
        fetch(endpoint)
            .then((response) => response.json())
            .then((data) => {
                setPhotos(data.photos);
            });
    }, [activeSol, activeCamera]);

    const handleSolChange = function (e) {
        setActiveSol(e.target.value);
    };

    const debouncedSolChangeHandler = useCallback(debounce(handleSolChange, 500), []);

    const handleCameraChange = function (e) {
        setActiveCamera(e.target.value);
    };

    return (
        <div className="rover-details">
            <div className="rover-hero">
                <div className="rover-hero-image">
                    <Image src={`/images/${rover.image}`} width="3000" height="2000" alt="" />
                </div>
                <div className="rover-hero-content">
                    <h1>{rover.name}</h1>
                    <div className="rover-hero-meta">
                        {manifestFields.map((field) => (
                            <div key={field.key}>
                                <strong>{field.name}</strong>
                                <span>{manifest[field.key]}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="rover-photos">
                <div className="sol-select">
                    <span>Sol {manifest.max_sol}</span>
                    <input type="range" min="1" max={manifest.max_sol} step="1" onChange={debouncedSolChangeHandler} />
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
                        <div key={photo.id} className="photo">
                            <img src={photo.img_src} alt="" loading="lazy" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export async function getStaticPaths() {
    const paths = rovers.map((rover) => ({
        params: { slug: rover.slug },
    }));

    return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
    const rover = rovers.find((rover) => {
        return rover.slug === params.slug;
    });

    const endpoint = `https://mars-photos.herokuapp.com/api/v1/manifests/${params.slug}`;
    const response = await fetch(endpoint);
    const data = await response.json();

    return {
        props: {
            rover,
            manifest: data.photo_manifest,
        },
    };
}
