---
title: "Module 1: A Brief History"
short_title: "A Brief History"
series: linux-notes
module_number: 1
slug: module-1
permalink: /notes/linux-notes/module-1/
date: 2026-02-23
description: "From Unix to Linux"
---

The command line isn't a relic; it is a deliberately designed tool for complex tasks. It is the standard interface for servers, research clusters, and embedded systems.

## 1.1 The Unix Philosophy
{: #section-1-1}

Born at Bell Labs (1969) by Ken Thompson and Dennis Ritchie. Unix introduced the core concepts we use today.

> **The Golden Rule:** "Write programs that do one thing and do it well. Write programs to work together."

### Core Concepts

- **Everything is a file:** Documents, hard drives, processes, and network sockets are all treated as files.
- **Text streams:** Programs talk to each other via plain text, not binary formats.
- **Composability:** Small tools chained together (pipes) solve complex problems.

## 1.2 The Linux Architecture
{: #section-1-2}

**GNU (1983):** Richard Stallman created the tools (Compiler, Shell, Editor) but lacked a kernel.
**Linux (1991):** Linus Torvalds wrote the kernel.

Combined, they form the operating system: **GNU/Linux**.

### The Stack

| Layer | Role |
|-------|------|
| **Hardware** | CPU, RAM, Disks |
| **Kernel (Linux)** | The "boss." Manages hardware resources and memory. Talks to hardware so software doesn't have to |
| **Shell (GNU)** | The "translator." Takes your text commands and sends instructions to the Kernel |
| **Applications** | Web servers, Python scripts, File browsers |

## 1.3 Distributions (Distros)
{: #section-1-3}

A "Distro" is the Kernel + Tools + Package Manager bundled together. The main difference for users is **how you install software**.

### Debian Family (Uses `apt`)

- **Debian:** Stable, slow updates. The foundation.
- **Ubuntu:** Most popular, user-friendly. Great driver support.
- **Kali:** Specialized for security/pentesting.

### Red Hat Family (Uses `dnf` / `rpm`)

- **RHEL:** Enterprise standard. Paid support.
- **Fedora:** Bleeding edge. Upstream for RHEL.
- **Rocky/Alma:** Free versions of RHEL.

### Others

- **Arch (`pacman`):** DIY, rolling release. Documentation is legendary.
- **Alpine (`apk`):** Tiny, used heavily in Docker/Containers.

> **Class Note:** We are using **Ubuntu**. Key command: `sudo apt install <package>`.

## 1.4 The Shell
{: #section-1-4}

The program that interprets your commands.

- **sh:** The ancestor. Minimal.
- **bash (Bourne Again Shell):** The Linux standard. Default on most systems.
- **zsh:** Modern, themeable. Default on macOS.

```bash
# Check your shell
echo $SHELL
```

### Terminal vs. Shell vs. Console

| Term | What it is |
|------|------------|
| **Terminal** | The window app (GNOME Terminal, iTerm2) |
| **Shell** | The text interpreter running *inside* the window (Bash, Zsh) |
| **Console** | The physical text display (mostly relevant for servers) |

## 1.5 Why CLI?
{: #section-1-5}

Why not just use a GUI?

- **Scale:** Rename 1 file? GUI. Rename 10,000 files? CLI (1 line of code).
- **Remote Access (SSH):** Servers don't have monitors. You access them via text.
- **Resources:** GUIs eat RAM; text is cheap.
- **Reproducibility (Crucial for Science):** A shell script documents exactly how data was processed. Clicking buttons is not reproducible research.
