import type { IEvidence } from "@electron/model/evidence";

const pipeline = [
    {
        $sort: { _id: -1 } as const
    },
    {
        $lookup: {
            as: "contractors",
            from: "contractors",
            let: { ids: "$contractorsIds" },
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
            as: "attachments",
            from: "media.files",
            let: { ids: "$attachmentsIds" },
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
    }
]

export async function getEvidences(projectId: string) {
    return await window
        .electron
        .db
        .list<IEvidence>("Evidence", [
            {
                $match: { projectId }
            },
            ...pipeline
        ])
}
