import Hero from "@next/components/hero";
import { SettingIcon } from "@next/components/icons";

export default function SettingsHero() {

    return <Hero
        icon={SettingIcon}
        title="Settings"
        subtitle="Configure Design & Behavior"
    />
}