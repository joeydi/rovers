import { rovers } from "../data/rovers.js";
import RoverHero from "../components/rover-hero.js";
import RoverPhotos from "../components/rover-photos.js";

export default function RoverDetails({ rover, manifest }) {
    return (
        <div className="rover-details">
            <RoverHero {...{ rover, manifest }} />
            <RoverPhotos {...{ rover, manifest }} />
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
