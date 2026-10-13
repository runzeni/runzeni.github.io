---
title: "Module 1: A Brief History"
short_title: "A Brief History"
series: linux-notes
module_number: 1
slug: module-1
permalink: /notes/linux-notes/module-1/
date: 2026-02-23
updated: 2026-10-13
description: "From Unix to Linux"
---

The shell is useful for repeatable file operations, remote work, and research workflows. A few ideas explain how its tools fit together.

## 1.1 The Unix Philosophy
{: #section-1-1}

Unix began at Bell Labs in 1969. Its lasting contribution is a style of composition: small programs can do useful work together through a common interface.

- **File interfaces:** Ordinary files, devices, and sockets share many input/output operations. This is a useful model, not a claim that every operating-system object is literally a file.
- **Streams:** A pipe carries bytes from one process to another. Many command-line tools use text; binary streams are possible too.
- **Composition:** Connect existing tools before writing a larger program.

## 1.2 The Linux Architecture
{: #section-1-2}

The GNU project was announced in 1983; Linux began in 1991. Many distributions combine the Linux kernel with GNU tools. Others use different user-space components, so “Linux” and “GNU/Linux” are not interchangeable in every context.

| Layer | Role |
| --- | --- |
| Hardware | Processors, memory, storage, and peripherals |
| Kernel | Manages processes, memory, devices, and system calls |
| Shell | Interprets commands, runs built-ins, and launches programs |
| Applications | Editors, web servers, analysis tools, and scripts |

## 1.3 Distributions (Distros)
{: #section-1-3}

A distribution packages a kernel, tools, repositories, and a release policy. Differences include software versions, defaults, support periods, and package management.

| Family | Examples | Package tools |
| --- | --- | --- |
| Debian | Debian, Ubuntu, Kali | `apt`, `dpkg` |
| Red Hat ecosystem | Fedora, RHEL, Rocky Linux, AlmaLinux | `dnf`, `rpm` |
| Arch | Arch Linux | `pacman` |
| Alpine | Alpine Linux | `apk` |

The class examples use Ubuntu. An installation command such as `sudo apt install package-name` is distribution-specific.

## 1.4 The Shell
{: #section-1-4}

Bash and Zsh are shells. A terminal emulator is the application that displays their input and output. A console may be physical or virtual; it is not necessarily a desktop window.

```bash
# Configured login shell; this may differ from the running shell
printf '%s\n' "$SHELL"

# Current shell process in an interactive Bash or Zsh session
ps -p "$$" -o comm=
```

`sh` names a shell interface used by many portable scripts; the implementation varies by system. Bash-specific syntax does not necessarily work with `sh`.

## 1.5 Why CLI?
{: #section-1-5}

A command can be saved, reviewed, and repeated across many inputs. SSH makes the same tools available on a remote machine. A script is only part of reproducibility: retain input versions, software versions, parameters, and logs as well.

## References

- [GNU project history](https://www.gnu.org/gnu/thegnuproject.html)
- [Bash manual](https://www.gnu.org/software/bash/manual/bash.html)
- [Linux pipe interface](https://man7.org/linux/man-pages/man7/pipe.7.html)
