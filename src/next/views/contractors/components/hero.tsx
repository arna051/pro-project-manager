import Hero from "@next/components/hero";
import { ContractorsIcon } from "@next/components/icons";

export default function ContractorsHero() {
    return <Hero
        icon={ContractorsIcon}
        title="Contractors"
        subtitle="Business partners & customers"
        button={{
            text: "New Contractor",
            href: "/contractors/save"
        }}
    />
}