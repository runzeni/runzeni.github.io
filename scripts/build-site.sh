#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$root"

required_ruby="$(tr -d '[:space:]' < .ruby-version)"
current_ruby="$(ruby -e 'print RUBY_VERSION' 2>/dev/null || true)"

# Homebrew does not prepend versioned Ruby formulae to PATH. Prefer the pinned
# project Ruby when it is installed, while leaving rbenv/asdf/mise setups alone.
if [[ "$current_ruby" != "$required_ruby"* ]]; then
  IFS=. read -r ruby_major ruby_minor _ <<< "$required_ruby"
  if [[ -n "${ruby_minor:-}" ]]; then
    homebrew_ruby="/opt/homebrew/opt/ruby@${ruby_major}.${ruby_minor}/bin"
    if [[ -x "$homebrew_ruby/ruby" ]]; then
      export PATH="$homebrew_ruby:$PATH"
      current_ruby="$(ruby -e 'print RUBY_VERSION')"
    fi
  fi
fi

if [[ "$current_ruby" != "$required_ruby"* ]]; then
  echo "Ruby ${required_ruby}.x is required (found ${current_ruby:-none})." >&2
  exit 1
fi

command="${1:-build}"
if [[ $# -gt 0 ]]; then
  shift
fi

case "$command" in
  build|serve) ;;
  *)
    echo "Usage: $0 [build|serve] [Jekyll options]" >&2
    exit 2
    ;;
esac

ruby scripts/build-photo-manifest.rb
exec bundle exec jekyll "$command" "$@"
