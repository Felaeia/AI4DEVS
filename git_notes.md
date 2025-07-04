Okay, I've updated the Git commands list with your additions! Here's the comprehensive guide:

---

## Git: Cause Why Not?

Git is a powerful version control system with a vast array of commands. Here's a comprehensive breakdown of the most common and essential Git commands, categorized for easier understanding:

### I. Getting & Creating Projects

* `git init`: Initializes a new Git repository in the current directory. This is the first step when starting a new Git project.
* `git clone <repository_url>`: Creates a local copy of a remote repository. This is how you get an existing project from platforms like GitHub or GitLab.
    * `git clone <repository_url> <directory_name>`: Clones a repository and names the local directory.
    * `git clone <repository_url> --origin <name>`: Clones a repository and names the remote.

### II. Basic Snapshotting (Working with changes)

* `git status`: Shows the status of your working directory and staging area, including modified, staged, and untracked files.
* `git add <file_name>`: Stages specific file changes for the next commit.
* `git add .` or `git add --all` or `git add -A`: Stages all modified and new files in the current directory for the next commit.
* `git commit -m "<message>"`: Records the staged changes as a new commit with a descriptive message.
* `git commit --amend`: Modifies the most recent commit (useful for correcting commit messages or adding forgotten files).
* `git rm <file_name>`: Deletes a file from the project and stages the removal.
* `git mv <existing_path> <new_path>`: Changes an existing file's path and stages the move.

### III. Branching & Merging (Managing parallel lines of development)

* `git branch`: Lists all local branches in the repository. An asterisk indicates the currently active branch.
* `git branch <branch_name>`: Creates a new branch at the current commit.
* `git branch -d <branch_name>`: Deletes a local branch (only if it's already merged).
* `git branch -D <branch_name>`: Forcefully deletes a local branch, even if it's not merged.
* `git checkout <branch_name>`: Switches to a different branch.
* `git checkout -b <new_branch_name>`: Creates a new branch and immediately switches to it.
* `git checkout -b <new_branch_name> <remote_name>/<branch_name>`: Creates a local branch from a remote branch and switches to it.
* `git merge <branch_name>`: Merges changes from the specified branch into the current branch.
* `git merge --abort`: Aborts a merge in progress, restoring the repository to its state before the merge attempt.
* `git rebase <target_branch_name>`: Reapplies commits from your current branch onto another branch, creating a cleaner, linear history.
* `git rebase --continue`: Continues a rebase after resolving conflicts.
* `git rebase --skip`: Skips the current commit during a rebase, if it's causing conflicts.
* `git rebase --abort`: Cancels a rebase operation.

### IV. Sharing & Updating Projects (Interacting with remote repositories)

* `git remote add <remote_name> <repository_url>`: Adds a remote repository connection to your local repository (e.g., `git remote add origin https://github.com/user/repo.git`).
* `git remote -v`: Shows the remote repositories configured for your local repository.
* `git fetch <remote_name>`: Downloads new commits and objects from a remote repository without merging them into your local branches.
* `git pull <remote_name> <branch_name>`: Fetches changes from a remote repository and immediately merges them into your current local branch. (Often `git pull origin main` or `git pull origin master`).
* `git push <remote_name> <branch_name>`: Uploads your local commits to the specified remote branch. (Often `git push origin main` or `git push origin master`).
* `git push -u <remote_name> <branch_name>`: Pushes changes and sets the upstream branch, so future `git push` and `git pull` commands don't require specifying the remote and branch.
* `git push <remote_name> --delete <remote_branch_name>`: Deletes a branch on the remote repository.

**How To push in GIT (Cause dum dum keeps forgetting lol)**

1.  `git add (file name)`
2.  `git commit -m "Message here"`
3.  `git push -u origin (branch name)` // You only need to do this once so it updates `git push`
4.  `git push` // After you have done `git push -u origin (branch name)`

**Remote Branch Operations**

* `git fetch --all`: Updates your local metadata with all remote branches.
* `git push origin --delete branch-name`: Delete (GitHub) remote branch.
* `git fetch --prune`: Sync Local and Remote Branch List.
* `git push -u origin my-feature-branch`: Push new branch to GitHub.

### V. Inspection & Comparison (Viewing history and differences)

* `git log`: Displays the commit history of the repository.
    * `git log --oneline`: Shows a simplified, one-line view of the commit history.
    * `git log --graph`: Displays the commit history with an ASCII art graph of the branch and merge history.
    * `git log -p`: Shows the full patch for each commit (the actual changes made).
    * `git log --author="<author_name>"`: Filters commits by author.
    * `git log --grep="<search_term>"`: Filters commits by message.
    * `git log <branchB>..<branchA>`: Shows commits present in `branchA` but not in `branchB`.
* `git diff`: Shows the differences between your working directory and the staging area (unstaged changes).
* `git diff --staged`: Shows the differences between the staging area and the last commit (staged changes ready to be committed).
* `git diff <commit1> <commit2>`: Shows the differences between two specific commits.
* `git show <commit_hash>`: Displays the metadata and content changes of a specific commit.
* `git blame <file_name>`: Shows who last modified each line of a file.

### VI. Undoing Changes & Rewriting History

* `git reset <file_name>`: Unstages a file while keeping the changes in your working directory.
* `git reset --hard <commit_hash>`: Resets the repository to a specific commit, discarding all changes in the working directory and staging area after that commit. Use with caution!
* `git revert <commit_hash>`: Creates a new commit that undoes the changes introduced by a specific commit. This is a safer way to undo changes as it preserves the history.
* `git reflog`: Displays a log of all actions performed on references (like HEAD), allowing you to recover from mistakes like hard resets.
* `git cherry-pick <commit_hash>`: Applies a specific commit from one branch to another.

### VII. Stashing (Temporarily saving changes)

* `git stash`: Temporarily saves changes in your working directory and staging area without committing them, allowing you to switch branches or perform other operations.
* `git stash list`: Lists all stashed changes.
* `git stash pop`: Applies the most recently stashed changes and removes them from the stash list.
* `git stash apply <stash@{n}>`: Applies a specific stash from the list without removing it.
* `git stash drop <stash@{n}>`: Deletes a specific stash from the list.
* `git stash clear`: Removes all stashed entries.

### VIII. Tagging (Marking significant points in history)

* `git tag <tag_name>`: Creates a lightweight tag for the current commit.
* `git tag -a <tag_name> -m "<message>"`: Creates an annotated tag with additional information (recommended for releases).
* `git tag`: Lists all tags.
* `git push <remote_name> <tag_name>`: Pushes a specific tag to the remote repository.
* `git push <remote_name> --tags`: Pushes all local tags to the remote repository.

### IX. Configuration

* `git config --global user.name "<your_name>"`: Sets your Git username globally.
* `git config --global user.email "<your_email>"`: Sets your Git email globally.
* `git config --list`: Displays all Git configuration settings.

### X. Other Useful Commands

* `git clean -f`: Removes untracked files from the working directory. Use with caution!
* `git bisect start`: Begins a binary search to find a commit that introduced a bug.
* `git help <command>`: Provides help and documentation for a specific Git command.

---

This list now includes all the commands you've provided, offering a comprehensive reference for your Git journey!