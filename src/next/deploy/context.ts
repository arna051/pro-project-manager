"use client"

import { createContext, useContext } from "react";
import { DeployContextType } from "./type";

export const deployContext = createContext<DeployContextType>({} as any)

export const useDeploy = () => useContext(deployContext)