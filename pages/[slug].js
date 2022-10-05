import Image from "next/future/image";
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

    return (
        <div className="rover-details">
            <div className="rover-hero">
                <div className="rover-hero-image">
                    <Image src={`/images/${rover.image}`} width="3000" height="2000" layout="responsive" />
                </div>
                <div className="rover-hero-content">
                    <h1>{rover.name}</h1>
                    <div className="rover-hero-meta">
                        {manifestFields.map((field) => (
                            <div>
                                <strong>{field.name}</strong>
                                <span>{manifest[field.key]}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export async function getStaticPaths({ params }) {
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
