import Hero from "@next/components/hero";
import { TodoIcon } from "@next/components/icons";

export default function TodoHero() {
    return <Hero
        icon={TodoIcon}
        title="Todo"
        subtitle="See All projects progress in one look!"
    />
}