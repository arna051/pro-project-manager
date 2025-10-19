"use client"

import SideBar from "./components/side-bar";

export default function MainLayout({ children }: ChildProp) {

    return <>
        <SideBar>
            {children}
        </SideBar>
    </>
}