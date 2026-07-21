---
title: "Module 2: The Basics"
series: linux-notes
module_number: 2
slug: module-2
permalink: /notes/linux-notes/module-2/
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
      The reference module: the commands you will use 90% of the time. The goal is to build muscle memory so the terminal feels like a natural extension of your thought process, rather than a barrier to your research.
    </p>
  </div>

  <nav class="module-toc" aria-label="Table of contents">
    <h2 class="module-toc-title">In This Module</h2>
    <ul>
      <li><a href="#section-2-1">2.1 Navigation</a></li>
      <li><a href="#section-2-2">2.2 File Operations</a></li>
      <li><a href="#section-2-3">2.3 Viewing & Searching</a></li>
      <li><a href="#section-2-4">2.4 Permissions</a></li>
      <li><a href="#section-2-5">2.5 Pipes & Redirection</a></li>
    </ul>
  </nav>

  <section id="section-2-1" class="content-section" markdown="block">

## 2.1 Navigation

Linux uses a hierarchical tree structure starting at the root (`/`).

```bash
# Print working directory — where am I?
pwd

# List files
ls            # basic listing
ls -l         # long format (permissions, size, date)
ls -la        # include hidden files (dotfiles like .bashrc)
ls -lh        # human-readable file sizes (KB, MB, GB)

# Change directory
cd /path/to/dir     # absolute path
cd relative/path    # relative path
cd ~                # home directory
cd ..               # parent directory
cd -                # previous directory (toggle)
                    # Note: extremely useful when jumping between
                    # a data directory and a script directory
```

</section>

<section id="section-2-2" class="content-section" markdown="block">

## 2.2 File Operations

### Creating, Copying, Moving, Renaming

```bash
# Create
touch file.txt          # create empty file (or update timestamp)
mkdir mydir             # create directory
mkdir -p a/b/c          # create nested directories (parent/child/grandchild)

# Copy
cp file.txt backup.txt          # copy file
cp -r mydir/ mydir_backup/      # copy directory recursively

# Move / Rename
mv file.txt newname.txt         # rename
mv file.txt /other/path/        # move
```

### Deleting

> **There is no trash can in the terminal. Deletion is permanent.**

```bash
rm file.txt             # delete file
rm -r mydir/            # delete directory recursively
rm -ri mydir/           # interactive — asks before every file
```

### Wildcards (Globbing)

- `*` matches anything (e.g., `*.csv` matches all CSV files)
- `?` matches exactly one character (e.g., `file?.txt` matches `file1.txt` but not `file10.txt`)

</section>

<section id="section-2-3" class="content-section" markdown="block">

## 2.3 Viewing & Searching

### Viewing Files

```bash
# View entire file
cat file.txt            # dump whole file to terminal (bad for large files)
less file.txt           # paginated view (q to quit, / to search)

# View parts
head file.txt           # first 10 lines
head -n 20 file.txt     # first 20 lines
tail file.txt           # last 10 lines
tail -f logfile.log     # follow a log file in real-time
```

### grep — The Search Tool

`grep` filters input line-by-line. Essential for bioinformatics (finding specific sequences, counting FASTA records, etc.).

```bash
# Basic search
grep "pattern" file.txt

# Case-insensitive
grep -i "pattern" file.txt

# Show line numbers
grep -n "pattern" file.txt

# Recursive search (all files in current directory)
grep -r "TODO" .

# Invert match (lines that do NOT match)
grep -v "error" log.txt

# Count matching lines
grep -c ">" sequences.fasta
```

</section>

<section id="section-2-4" class="content-section" markdown="block">

## 2.4 Permissions

Every file has a mode string (e.g., `-rwxr-xr--`) defining who can do what.

### The Bits

| Symbol | Meaning | Octal Value |
|--------|---------|-------------|
| `r`    | Read    | 4           |
| `w`    | Write   | 2           |
| `x`    | Execute | 1           |

### Changing Permissions (`chmod`)

```bash
# Symbolic mode (easier to read)
chmod +x script.sh        # add execute for everyone
chmod u+w file.txt        # add write for owner (u=user)
chmod go-r private.key    # remove read for group and others

# Numeric mode (faster to type)
chmod 755 script.sh       # rwx (7) for owner, r-x (5) for group/others
chmod 644 file.txt        # rw- (6) for owner, r-- (4) for group/others
chmod 600 private.key     # rw- (6) for owner, --- (0) for group/others
```

</section>

<section id="section-2-5" class="content-section" markdown="block">

## 2.5 Pipes & Redirection

### Redirection

| Operator | Behavior |
|----------|----------|
| `>`      | Overwrite output to a file |
| `>>`     | Append output to the end of a file |
| `2>`     | Redirect stderr (errors) only |

```bash
echo "Analysis Complete" > status.txt    # creates/overwrites file
echo "Error found" >> log.txt            # appends to file
```

### Pipes (`|`)

Passes the stdout of the left command to the stdin of the right command.

```bash
# Count number of Python files
find . -name "*.py" | wc -l

# Check for errors in the last 50 lines of a log
tail -n 50 app.log | grep "Error"

# Unique sorted values (classic combo)
cat data.txt | sort | uniq
# This is the Unix philosophy in action — small tools chaining
# together to solve complex problems without a custom script.
```

</section>

</article>
