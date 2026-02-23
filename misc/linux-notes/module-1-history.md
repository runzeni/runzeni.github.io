---
title: "Module 1: A Brief History"
breadcrumb_title: Module 1
permalink: /misc/linux-notes/module-1/
layout: default
series: linux-notes
module_number: 1
prev_module: null
next_module: /misc/linux-notes/module-2/
date: 2026-02-23
description: "From Unix to Linux — how we got here, what a shell is, and why any of this matters."
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
      "The Linux command line is a text interface to your computer."
    </p>
    <p>
      Before we start typing commands, it helps to know where all of this came from. The command line isn't some ancient relic — it's a deliberately designed tool that has evolved over 50+ years and is still the backbone of servers, research clusters, and pretty much everything on the internet.
    </p>
  </div>

  <nav class="module-toc" aria-label="Table of contents">
    <h2 class="module-toc-title">In This Module</h2>
    <ul>
      <li><a href="#section-1-1">1.1 The Unix Origins</a></li>
      <li><a href="#section-1-2">1.2 Enter GNU & Linux</a></li>
      <li><a href="#section-1-3">1.3 The Distro Landscape</a></li>
      <li><a href="#section-1-4">1.4 What Is a Shell?</a></li>
      <li><a href="#section-1-5">1.5 Why the Command Line?</a></li>
    </ul>
  </nav>

  <section id="section-1-1" class="content-section">
    <h2>1.1 The Unix Origins</h2>

    <p>
      It all started at <strong>Bell Labs</strong> in 1969. Ken Thompson and Dennis Ritchie (the same Ritchie who created the C programming language) built Unix as a small, elegant operating system. The core philosophy was simple:
    </p>

    <blockquote>
      Do one thing and do it well.
    </blockquote>

    <p>
      Unix introduced ideas we still use every day:
    </p>

    <ul>
      <li><strong>Everything is a file</strong> — devices, processes, sockets, all represented as files</li>
      <li><strong>Plain text as universal interface</strong> — programs communicate through text streams</li>
      <li><strong>Small, composable tools</strong> — chain simple programs together to do complex things</li>
      <li><strong>Hierarchical filesystem</strong> — the <code>/</code> root directory tree we still navigate today</li>
    </ul>

    <h3>The Timeline</h3>

    <ul>
      <li><strong>1969</strong> — Unix born at Bell Labs (PDP-7)</li>
      <li><strong>1973</strong> — Rewritten in C (a huge deal — made it portable across hardware)</li>
      <li><strong>1970s–80s</strong> — AT&T licenses Unix to universities; UC Berkeley creates BSD</li>
      <li><strong>1983</strong> — AT&T commercializes Unix → becomes expensive and proprietary</li>
    </ul>

    <p>
      That last point is what sets the stage for everything that follows.
    </p>

  </section>

  <section id="section-1-2" class="content-section">
    <h2>1.2 Enter GNU & Linux</h2>

    <p>
      In 1983, <strong>Richard Stallman</strong> launched the <strong>GNU Project</strong> (GNU's Not Unix — yes, it's recursive) with the goal of creating a completely free Unix-like operating system. He wrote essential tools — compiler (<code>gcc</code>), editor (<code>emacs</code>), shell (<code>bash</code>) — but the kernel was missing.
    </p>

    <p>
      Then in 1991, a Finnish student named <strong>Linus Torvalds</strong> posted this now-famous message to the comp.os.minix newsgroup:
    </p>

    <blockquote>
      "I'm doing a (free) operating system (just a hobby, won't be big and professional like gnu)…"
    </blockquote>

    <p>
      That "hobby" became the <strong>Linux kernel</strong>. Combined with the GNU userspace tools, it formed a complete free operating system: <mark>GNU/Linux</mark>.
    </p>

    <h3>Kernel vs. OS — What's the Difference?</h3>

    <ul>
      <li><strong>Kernel</strong> — the core. Manages hardware, memory, processes, scheduling. Linux is a kernel.</li>
      <li><strong>OS / Distribution</strong> — the kernel + shell + package manager + desktop environment + everything else. Ubuntu, Fedora, Arch — these are distributions.</li>
    </ul>

    <p>
      When people say "Linux," they usually mean the whole distribution, not just the kernel. Stallman would prefer you say "GNU/Linux," and honestly, he has a point.
    </p>

  </section>

  <section id="section-1-3" class="content-section">
    <h2>1.3 The Distro Landscape</h2>

    <p>
      There are hundreds of Linux distributions. Here's a practical breakdown of the ones you'll actually encounter:
    </p>

    <h3>Debian Family</h3>

    <ul>
      <li><strong>Debian</strong> — the grandfather. Rock-solid stability, slower release cycle. Uses <code>apt</code> / <code>.deb</code> packages.</li>
      <li><strong>Ubuntu</strong> — Debian-based, beginner-friendly, most popular desktop distro. Also uses <code>apt</code>.</li>
      <li><strong>Linux Mint</strong> — Ubuntu-based, even more beginner-friendly.</li>
    </ul>

    <h3>Red Hat Family</h3>

    <ul>
      <li><strong>RHEL (Red Hat Enterprise Linux)</strong> — enterprise standard, paid support. Uses <code>dnf</code> / <code>.rpm</code> packages.</li>
      <li><strong>Fedora</strong> — RHEL's upstream testing ground. Bleeding edge, also uses <code>dnf</code>.</li>
      <li><strong>CentOS / Rocky / Alma</strong> — free RHEL rebuilds for servers.</li>
    </ul>

    <h3>Other Notables</h3>

    <ul>
      <li><strong>Arch Linux</strong> — rolling release, DIY, teaches you everything. Uses <code>pacman</code>.</li>
      <li><strong>openSUSE</strong> — stable and polished. Uses <code>zypper</code>.</li>
      <li><strong>Alpine</strong> — ultra-lightweight, popular in Docker containers. Uses <code>apk</code>.</li>
    </ul>

    <blockquote>
      <strong>My note:</strong> For class I'm mostly working with Ubuntu on WSL or a VM. The apt commands are the ones I'll use the most.
    </blockquote>

  </section>

  <section id="section-1-4" class="content-section">
    <h2>1.4 What Is a Shell?</h2>

    <p>
      The <strong>shell</strong> is the program that interprets your commands and talks to the kernel. When you open a "terminal," you're really opening a <em>terminal emulator</em> that runs a shell inside it.
    </p>

    <h3>Common Shells</h3>

    <ul>
      <li><strong>sh</strong> (Bourne Shell) — the original, 1979. Minimal.</li>
      <li><strong>bash</strong> (Bourne Again Shell) — the default on most Linux distros. What we'll use.</li>
      <li><strong>zsh</strong> — default on macOS since Catalina. Bash-compatible + extras (better autocomplete, themes).</li>
      <li><strong>fish</strong> — user-friendly, auto-suggestions out of the box, but not POSIX-compatible.</li>
    </ul>

    <p>
      Check which shell you're running:
    </p>

```bash
echo $SHELL
# /bin/bash or /bin/zsh typically
```

    <p>
      See all available shells on your system:
    </p>

```bash
cat /etc/shells
```

    <h3>Terminal vs. Shell vs. Console</h3>

    <ul>
      <li><strong>Terminal (emulator)</strong> — the window application (iTerm2, GNOME Terminal, Windows Terminal)</li>
      <li><strong>Shell</strong> — the interpreter running inside the terminal (bash, zsh)</li>
      <li><strong>Console</strong> — historically, the physical hardware; now often used loosely to mean terminal</li>
    </ul>

  </section>

  <section id="section-1-5" class="content-section">
    <h2>1.5 Why the Command Line?</h2>

    <p>
      Fair question — we have GUIs everywhere. Why bother with a text interface?
    </p>

    <ul>
      <li><strong>Automation</strong> — you can script anything. Run 10,000 files through a pipeline overnight.</li>
      <li><strong>Remote access</strong> — SSH into a server on the other side of the world. No GUI needed, no bandwidth wasted.</li>
      <li><strong>Reproducibility</strong> — a shell script is a precise record of what you did. Essential for research and bioinformatics.</li>
      <li><strong>Speed</strong> — renaming 500 files takes one line on the command line, 500 clicks in a GUI.</li>
      <li><strong>Servers don't have GUIs</strong> — most of the internet runs on headless Linux machines.</li>
    </ul>

    <blockquote>
      <strong>My note:</strong> As a biology student, the command line is basically unavoidable once you start doing any kind of computational work — sequence alignment, proteomics pipelines, RNA-seq, anything involving a computing cluster.
    </blockquote>

    <p>
      <strong>Next up:</strong> We get our hands dirty with actual commands.
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
      <span class="module-nav-disabled"></span>

      <a href="/misc/linux-notes/module-2/" class="module-nav-next">
        <span>Next Module</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </a>
    </div>
  </div>
</nav>
