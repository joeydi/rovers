import Link from "next/link";
import Image from "next/future/image";
import { rovers } from "../data/rovers.js";

export default function RoversIndex() {
    return (
        <div className="rovers-index">
            <div className="rovers-index-hero">
                <h1>Rovers</h1>
            </div>
            <div className="rovers-index-links">
                {rovers.map((rover) => (
                    <Link key={rover.slug} href={`/${rover.slug}`}>
                        <a>
                            <Image src={`/images/${rover.image}`} width="3000" height="2000" layout="responsive" />
                            <h2>{rover.name}</h2>
                        </a>
                    </Link>
                ))}
            </div>
        </div>
    );
}
