#!/usr/bin/env bash
set -euo pipefail

# Generate ignored responsive WebPs served by Fotos. Source files remain
# untouched and are excluded from the published Jekyll artifact.

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
source_dir="$root/assets/img"
output_dir="$source_dir/derived"
recipe="$root/scripts/build-photo-derivatives.sh"
variant_widths=(640 1200 1920)

if command -v magick >/dev/null; then
  image_tool=(magick)
elif command -v convert >/dev/null; then
  image_tool=(convert)
else
  echo "ImageMagick (magick or convert) is required." >&2
  exit 1
fi

render_source() {
  local source="$1"
  local relative="${source#"$source_dir"/}"
  local stem="${relative%.*}"
  local source_width
  source_width="$("${image_tool[@]}" "$source" -auto-orient -format '%w' info:)"

  for requested_width in "${variant_widths[@]}"; do
    local width="$requested_width"
    if (( source_width < requested_width )); then
      width="$source_width"
    fi

    local target="$output_dir/${stem}-${width}w.webp"
    if [[ "${PHOTO_FORCE:-false}" != true && -f "$target" && ! "$source" -nt "$target" && ! "$recipe" -nt "$target" ]]; then
      echo current
    else
      mkdir -p "$(dirname "$target")"
      "${image_tool[@]}" "$source" \
        -auto-orient \
        -strip \
        -resize "${width}x>" \
        -quality 80 \
        -define webp:method=6 \
        "$target"
      echo rendered
    fi

    (( source_width <= requested_width )) && break
  done
}

if [[ "${1:-}" == "--render-source" ]]; then
  [[ $# == 2 ]] || exit 2
  render_source "$2"
  exit
fi

force=false
case "${1:-}" in
  "") ;;
  --force) force=true ;;
  --clean)
    force=true
    if [[ -d "$output_dir" ]]; then
      find "$output_dir" -type f -name '*.webp' -delete
    fi
    ;;
  *)
    echo "Usage: $0 [--force|--clean]" >&2
    exit 2
    ;;
esac

detect_jobs() {
  local detected=""
  if [[ "$(uname -s)" == "Darwin" ]]; then
    detected="$(sysctl -n hw.ncpu 2>/dev/null || true)"
  fi
  [[ "$detected" =~ ^[1-9][0-9]*$ ]] || detected="$(getconf _NPROCESSORS_ONLN 2>/dev/null || true)"
  [[ "$detected" =~ ^[1-9][0-9]*$ ]] || detected=4
  (( detected > 18 )) && detected=18
  echo "$detected"
}

jobs="${PHOTO_JOBS:-$(detect_jobs)}"
if [[ ! "$jobs" =~ ^[1-9][0-9]*$ ]]; then
  echo "PHOTO_JOBS must be a positive integer." >&2
  exit 2
fi

source_list="$(mktemp)"
trap 'rm -f "$source_list"' EXIT

bulk_dirs=()
for directory in "$source_dir"/[0-9][0-9][0-9][0-9]; do
  [[ -d "$directory" ]] && bulk_dirs+=("$directory")
done
[[ -d "$source_dir/cine" ]] && bulk_dirs+=("$source_dir/cine")

if (( ${#bulk_dirs[@]} > 0 )); then
  find "${bulk_dirs[@]}" -type f \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' \) -print0 >> "$source_list"
fi

# Only selected works need renditions from the standalone portfolio directory.
ruby -ryaml -e '
  root = ARGV.fetch(0)
  data = YAML.load_file(ARGV.fetch(1)).fetch("photos")
  data.each do |photo|
    source = photo.fetch("src")
    next unless source.start_with?("/assets/img/portfolio/")
    STDOUT.write(File.join(root, source.delete_prefix("/assets/img/")), "\0")
  end
' "$source_dir" "$root/_data/portfolio.yml" >> "$source_list"

export PHOTO_FORCE="$force"
export MAGICK_THREAD_LIMIT=1

stats="$(
  xargs -0 -n 1 -P "$jobs" "$recipe" --render-source < "$source_list" |
    awk '
      $1 == "rendered" { rendered += 1 }
      $1 == "current" { current += 1 }
      END { printf "%d rendered, %d already current", rendered, current }
    '
)"

echo "Photo derivatives (${jobs} workers): ${stats}."
