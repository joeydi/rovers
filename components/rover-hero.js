import Image from "next/future/image";

const manifestFields = [
    // { name: "Name", key: "name" },
    { name: "Launch Date", key: "launch_date" },
    { name: "Landing Date", key: "landing_date" },
    { name: "Max Date", key: "max_date" },
    { name: "Max Sol", key: "max_sol" },
    // { name: "Status", key: "status" },
    { name: "Total Photos", key: "total_photos" },
];

export default function RoverHero({ rover, manifest }) {
    return (
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
    );
}
