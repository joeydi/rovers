import { useState } from "react";

import { rovers } from "../data/rovers.js";
import RoverHero from "../components/rover-hero.js";
import RoverPhotos from "../components/rover-photos.js";
import PhotoDetails from "../components/photo-details.js";

export default function RoverDetails({ rover, manifest }) {
    const [activePhoto, setActivePhoto] = useState();

    return (
        <div className="rover-details">
            <RoverHero {...{ rover, manifest }} />
            <RoverPhotos {...{ rover, manifest, setActivePhoto }} />
            {activePhoto && <PhotoDetails photo={activePhoto} setActivePhoto={setActivePhoto} />}
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
