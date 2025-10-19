import { IProject } from "@electron/model/project";

const pipeline = [
    {
        $sort: {
            lastCheck: -1 as const
        }
    },
    {
        $lookup: {
            as: "contractors",
            from: "contractors",
            let: { ids: "$contractorIds" },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $in: ["$_id", "$$ids"]
                        }
                    }
                }
            ]
        }
    },
    {
        $lookup: {
            as: "servers",
            from: "servers",
            let: { ids: "$serversIds" },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $in: ["$_id", "$$ids"]
                        }
                    }
                }
            ]
        }
    },
    {
        $lookup: {
            as: "categories",
            from: "categories",
            let: { ids: "$categoryIds" },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $in: ["$_id", "$$ids"]
                        }
                    }
                }
            ]
        }
    },
    {
        $lookup: {
            as: "repos",
            from: "repositories",
            foreignField: "projectId",
            localField: "_id",
        }
    }
]

export async function getProjects() {
    return await window
        .electron
        .db
        .list<IProject>("Project", pipeline)
}

export async function getProject(id: string) {
    return await window
        .electron
        .db
        .doc<IProject>("Project", [{ $match: { _id: id } }, ...pipeline])
}