import { exec } from "child_process";
import util from "util";

const execAsync = util.promisify(exec);

export interface GitData {
    branches: string[];
    currentBranch: string;
    dirty: boolean;
}

export async function getGitData(dir: string): Promise<GitData> {
    try {
        // Get branches
        const { stdout: branchesOut } = await execAsync("git branch --list", { cwd: dir });
        let currentBranch = "";
        const branches = branchesOut
            .split("\n")
            .map((b) => {
                if (b.startsWith("*")) {
                    currentBranch = b.replace("*", "").trim();
                }
                return b.replace("*", "").trim();
            })
            .filter((b) => b.length > 0);

        // Check if repo has uncommitted/untracked changes
        const { stdout: statusOut } = await execAsync("git status --porcelain", { cwd: dir });
        const dirty = statusOut.trim().length > 0;

        return { branches, currentBranch, dirty };
    } catch (err: any) {
        throw new Error(`Failed to get git data: ${err.message}`);
    }
}
