---
title: "Module 1: A Brief History"
series: linux-notes
module_number: 1
slug: module-1
permalink: /notes/linux-notes/module-1/
date: 2026-02-23
description: "From Unix to Linux"
---

<header class="module-header">
  <div class="module-meta">
    <span class="module-series-badge">Linux Notes</span>
    <span class="module-number-badge">Module 1 of 3</span>
  </div>
  <h1>A Brief History</h1>
  <div class="module-header-meta">
    <span class="module-date">February 2026</span>
  </div>
</header>

<article class="module-content">

  <div class="module-intro">
    <p class="lead-paragraph">
      The command line isn't a relic; it is a deliberately designed tool for complex tasks. It is the standard interface for servers, research clusters, and embedded systems.
    </p>
  </div>

  <nav class="module-toc" aria-label="Table of contents">
    <h2 class="module-toc-title">In This Module</h2>
    <ul>
      <li><a href="#section-1-1">1.1 The Unix Philosophy</a></li>
      <li><a href="#section-1-2">1.2 The Linux Architecture</a></li>
      <li><a href="#section-1-3">1.3 Distributions (Distros)</a></li>
      <li><a href="#section-1-4">1.4 The Shell</a></li>
      <li><a href="#section-1-5">1.5 Why CLI?</a></li>
    </ul>
  </nav>

  <section id="section-1-1" class="content-section" markdown="block">

## 1.1 The Unix Philosophy

Born at Bell Labs (1969) by Ken Thompson and Dennis Ritchie. Unix introduced the core concepts we use today.

> **The Golden Rule:** "Write programs that do one thing and do it well. Write programs to work together."

### Core Concepts

- **Everything is a file:** Documents, hard drives, processes, and network sockets are all treated as files.
- **Text streams:** Programs talk to each other via plain text, not binary formats.
- **Composability:** Small tools chained together (pipes) solve complex problems.

</section>

<section id="section-1-2" class="content-section" markdown="block">

## 1.2 The Linux Architecture

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

</section>

<section id="section-1-3" class="content-section" markdown="block">

## 1.3 Distributions (Distros)

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

</section>

<section id="section-1-4" class="content-section" markdown="block">

## 1.4 The Shell

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

</section>

<section id="section-1-5" class="content-section" markdown="block">

## 1.5 Why CLI?

Why not just use a GUI?

- **Scale:** Rename 1 file? GUI. Rename 10,000 files? CLI (1 line of code).
- **Remote Access (SSH):** Servers don't have monitors. You access them via text.
- **Resources:** GUIs eat RAM; text is cheap.
- **Reproducibility (Crucial for Science):** A shell script documents exactly how data was processed. Clicking buttons is not reproducible research.

</section>

</article>
