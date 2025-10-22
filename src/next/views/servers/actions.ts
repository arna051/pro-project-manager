
export const actions = {
    "execute_on_local": {
        name: "execute_on_local",
        label: "Execute On Local",
        desc: "execute a command on a local machine"
    },
    "execute_on_remote": {
        name: "execute_on_remote",
        label: "Execute On Remote",
        desc: "execute a command on a remote server."
    },
    "get_projects": {
        name: "get_projects",
        label: "Get Projects",
        desc: "get list of projects in json"
    },
    "get_categories": {
        name: "get_categories",
        label: "Get Categories",
        desc: "get list of categories in json"
    },
    "get_servers": {
        name: "get_servers",
        label: "Get Servers",
        desc: "get list of servers in json"
    },
    "get_repos": {
        name: "get_repos",
        label: "Get Repositories",
        desc: "get list of all repositories"
    },
    "get_reminders": {
        name: "get_reminders",
        label: "Get Reminders",
        desc: "get list of reminders"
    },
    "get_current_time": {
        name: "get_current_time",
        label: "Get Time",
        desc: "get current system time in ISO format"
    },
    "save_entity": {
        name: "save_entity",
        label: "Save Entity",
        desc: "Save an entity (project, repo, category, or server) to the DB.",
    },
    "add_reminder": {
        name: "add_reminder",
        label: "Add Reminder",
        desc: "Add a reminder directly to the db.",
    },
    "remove_reminder": {
        name: "remove_reminder",
        label: "Remove Reminder",
        desc: "remove a reminder directly from the db.",
    },
    "push_all_to_git": {
        name: "push_all_to_git",
        label: "Push repositories to remote | github actions",
        desc: "push all repos to the remote repo.",
    },
    "deploy_repo": {
        name: "deploy_repo",
        label: "Deploy Project",
        desc: "deploy repository through deploy scripts its have. returns results",
    },
    "execute_on_repo": {
        name: "execute_on_repo",
        label: "Run command on repository folder",
        desc: "run a command on the repo folder",
    },
    "open_repo_for_user": {
        name: "open_repo_for_user",
        label: "Opening Repo...",
        desc: "opens the repo fo user in vs-code",
    },
    "execute_command_on_user_terminal": {
        name: "execute_command_on_user_terminal",
        label: "Execute on terminal",
        desc: "execute a command on user terminal",
    },
    "open_browser": {
        name: "open_browser",
        label: "Opening Url...",
        desc: "opens a url for user in browser.",
    },
    "open_folder_select_dialog": {
        name: "open_folder_select_dialog",
        label: "Opening Folder...",
        desc: "opens folder select dialog of electron. let user selects a folder and then return path to you",
    },
    "open_file_select_dialog": {
        name: "open_file_select_dialog",
        label: "Opening File...",
        desc: "opens file select dialog of electron. let user selects a file and then return file object to you",
    },
    "confirm": {
        name: "confirm",
        label: "Confirm...",
        desc: "opens confirm dialog for user that includes your message. use it when you want get conformation from user.",
    },
} as const