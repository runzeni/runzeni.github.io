---
title: "Module 2: The Basics"
breadcrumb_title: Module 2
permalink: /misc/linux-notes/module-2/
layout: default
series: linux-notes
module_number: 2
prev_module: /misc/linux-notes/module-1/
next_module: /misc/linux-notes/module-3/
date: 2026-02-23
description: "Essential commands for navigating the filesystem, manipulating files, and getting things done in the terminal."
---

<header class="module-header">
  <div class="module-meta">
    <span class="module-series-badge">Linux Notes</span>
    <span class="module-number-badge">Module 2 of 3</span>
  </div>
  <h1>The Basics</h1>
  <div class="module-header-meta">
    <span class="module-date">February 2026</span>
  </div>
</header>

<article class="module-content">

  <div class="module-intro">
    <p class="lead-paragraph">
      "Type less, do more."
    </p>
    <p>
      This is the reference module — the commands you'll use every single day. I keep coming back to this page more than any other, so I'm trying to keep it clean and scannable. Each section has the command, what it does, and the flags I actually use.
    </p>
  </div>

  <nav class="module-toc" aria-label="Table of contents">
    <h2 class="module-toc-title">In This Module</h2>
    <ul>
      <li><a href="#section-2-1">2.1 Navigation</a></li>
      <li><a href="#section-2-2">2.2 File Operations</a></li>
      <li><a href="#section-2-3">2.3 Viewing & Searching Text</a></li>
      <li><a href="#section-2-4">2.4 Permissions & Ownership</a></li>
      <li><a href="#section-2-5">2.5 Pipes & Redirection</a></li>
    </ul>
  </nav>

  <section id="section-2-1" class="content-section">
    <h2>2.1 Navigation</h2>

    <p>
      Moving around the filesystem. These become muscle memory fast.
    </p>

```bash
# Print working directory — where am I?
pwd

# List files
ls            # basic listing
ls -l         # long format (permissions, size, date)
ls -la        # include hidden files (dotfiles)
ls -lh        # human-readable file sizes

# Change directory
cd /path/to/dir     # absolute path
cd relative/path    # relative path
cd ~                # home directory
cd ..               # parent directory
cd -                # previous directory (toggle)
```

    <h3>Useful Shortcuts</h3>

```bash
# Tab completion — start typing and press Tab
cd Doc[Tab]     # completes to cd Documents/

# History
history             # list command history
!!                  # repeat last command
!grep               # repeat last command starting with "grep"
Ctrl + R            # reverse search through history (very handy)
```

    <blockquote>
      <strong>My note:</strong> <code>cd -</code> is underrated. Toggles between two directories like Alt+Tab for folders.
    </blockquote>

  </section>

  <section id="section-2-2" class="content-section">
    <h2>2.2 File Operations</h2>

    <p>
      Creating, copying, moving, and deleting files and directories.
    </p>

```bash
# Create
touch file.txt          # create empty file (or update timestamp)
mkdir mydir             # create directory
mkdir -p a/b/c          # create nested directories

# Copy
cp file.txt backup.txt          # copy file
cp -r mydir/ mydir_backup/      # copy directory recursively

# Move / Rename
mv file.txt newname.txt         # rename
mv file.txt /other/path/        # move

# Delete (careful — no trash can!)
rm file.txt             # delete file
rm -r mydir/            # delete directory recursively
rm -ri mydir/           # interactive — asks before each deletion
```

    <blockquote>
      <strong>⚠️ Warning:</strong> <code>rm -rf</code> is permanent. There is no undo, no recycle bin. Double-check your path before hitting Enter.
    </blockquote>

    <h3>Wildcards (Globbing)</h3>

```bash
# * matches anything
ls *.txt              # all .txt files
rm data_*.csv         # all CSV files starting with "data_"

# ? matches a single character
ls file?.txt          # file1.txt, fileA.txt, etc.

# [] matches character sets
ls file[1-3].txt      # file1.txt, file2.txt, file3.txt
```

  </section>

  <section id="section-2-3" class="content-section">
    <h2>2.3 Viewing & Searching Text</h2>

    <p>
      Reading files and finding things inside them.
    </p>

```bash
# View entire file
cat file.txt            # print whole file to terminal
less file.txt           # paginated view (q to quit, / to search)

# View parts of a file
head file.txt           # first 10 lines
head -n 20 file.txt     # first 20 lines
tail file.txt           # last 10 lines
tail -f logfile.log     # follow a log file in real-time

# Count
wc file.txt             # lines, words, characters
wc -l file.txt          # just line count
```

    <h3>grep — The Search Tool</h3>

    <p>
      Possibly the single most useful command for a bioinformatics student.
    </p>

```bash
# Basic search
grep "pattern" file.txt

# Case-insensitive
grep -i "pattern" file.txt

# Recursive — search all files in a directory
grep -r "TODO" ./project/

# Show line numbers
grep -n "error" logfile.log

# Invert match — show lines that DON'T match
grep -v "comment" file.txt

# Count matches
grep -c "ATCG" sequences.fasta
```

    <h3>find — Locate Files</h3>

```bash
# Find by name
find . -name "*.py"               # all Python files in current dir tree
find /home -name "data.csv"       # specific file anywhere under /home

# Find by type
find . -type d                    # directories only
find . -type f -name "*.log"      # files only

# Find by modification time
find . -mtime -7                  # modified in the last 7 days

# Find and do something
find . -name "*.tmp" -delete      # find and delete
find . -name "*.sh" -exec chmod +x {} \;   # find and make executable
```

  </section>

  <section id="section-2-4" class="content-section">
    <h2>2.4 Permissions & Ownership</h2>

    <p>
      Every file has an owner, a group, and permission bits. The <code>ls -l</code> output looks like this:
    </p>

```
-rwxr-xr-- 1 runze staff 4096 Feb 23 10:00 script.sh
│├─┤├─┤├─┤
│ │   │  └── others: read only
│ │   └───── group: read + execute
│ └───────── owner: read + write + execute
└──────────── file type (- = file, d = directory, l = symlink)
```

    <h3>chmod — Change Permissions</h3>

```bash
# Symbolic mode
chmod +x script.sh        # add execute for everyone
chmod u+w file.txt        # add write for owner (u=user, g=group, o=others)
chmod go-rwx private.key  # remove all permissions for group and others

# Numeric mode (octal)
chmod 755 script.sh       # rwxr-xr-x (owner: all, group/others: read+exec)
chmod 644 file.txt        # rw-r--r-- (owner: read+write, others: read)
chmod 600 private.key     # rw------- (owner only)
```

    <p>
      Quick reference for octal: <strong>r=4, w=2, x=1</strong>. Add them up per group.
    </p>

    <h3>chown — Change Ownership</h3>

```bash
chown runze file.txt              # change owner
chown runze:staff file.txt        # change owner and group
chown -R runze:staff ./project/   # recursive
```

  </section>

  <section id="section-2-5" class="content-section">
    <h2>2.5 Pipes & Redirection</h2>

    <p>
      This is where the Unix philosophy comes alive — chain small tools together to do powerful things.
    </p>

    <h3>Redirection</h3>

```bash
# Output to file (overwrite)
echo "hello" > output.txt

# Output to file (append)
echo "world" >> output.txt

# Redirect stderr
command 2> errors.log

# Redirect both stdout and stderr
command > all_output.log 2>&1

# Discard output
command > /dev/null 2>&1
```

    <h3>Pipes</h3>

    <p>
      The <code>|</code> (pipe) sends the output of one command as input to the next.
    </p>

```bash
# Count Python files in a project
find . -name "*.py" | wc -l

# Find the 10 largest files
du -ah . | sort -rh | head -10

# Search command history
history | grep "ssh"

# Unique sorted list
cat data.txt | sort | uniq

# Chain multiple filters
cat access.log | grep "404" | awk '{print $7}' | sort | uniq -c | sort -rn | head -20
```

    <blockquote>
      <strong>My note:</strong> That last one-liner is a classic — it finds the top 20 URLs that returned 404 errors in a web server log. Once you get comfortable with pipes, you start thinking in pipelines. It's like building with LEGO.
    </blockquote>

    <h3>Handy Combos I Keep Forgetting</h3>

```bash
# Sort a CSV by the 3rd column numerically
sort -t',' -k3 -n data.csv

# Remove duplicate lines (file must be sorted first)
sort file.txt | uniq

# Replace text in a file (sed)
sed -i 's/old/new/g' file.txt

# Quick column extraction (awk)
awk -F',' '{print $1, $3}' data.csv
```

    <p>
      <strong>Next up:</strong> Putting it all together — bioinformatics workflows in Python using the command line.
    </p>

  </section>

</article>

<nav class="module-navigation" aria-label="Module navigation">
  <div class="module-nav-container">

    <a href="/misc/linux-notes/" class="module-nav-overview">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="3" y="3" width="7" height="7"></rect>
        <rect x="14" y="3" width="7" height="7"></rect>
        <rect x="14" y="14" width="7" height="7"></rect>
        <rect x="3" y="14" width="7" height="7"></rect>
      </svg>
      <span>Back to Overview</span>
    </a>

    <div class="module-nav-arrows">
      <a href="/misc/linux-notes/module-1/" class="module-nav-prev">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
        <span>Previous Module</span>
      </a>

      <a href="/misc/linux-notes/module-3/" class="module-nav-next">
        <span>Next Module</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </a>
    </div>
  </div>
</nav>
