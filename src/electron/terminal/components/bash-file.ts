import os from "os";
import path from "path";
import fs from "fs";
import { v4 } from "uuid";
import { spawn } from "child_process";

const temp = path.join(os.homedir(), ".project-manager-executables");
const file = path.join(temp, v4().concat(".sh"));

if (!fs.existsSync(temp)) fs.mkdirSync(temp);

fs.readdirSync(temp).forEach(x => {
    fs.unlinkSync(path.join(temp, x))
})
export default function createBashFile(content: string): string {

    fs.writeFileSync(file, content, { encoding: 'utf-8' });

    spawn("chmod", ["+x", file]);

    return file;
}