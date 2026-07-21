#!/usr/bin/env bash
set -euo pipefail

# Generate ignored WebP web renditions served by Fotos. Original JPEGs remain
# untouched in the repository but are excluded from the published site.

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
source_dir="$root/assets/img"
output_dir="$source_dir/derived"

if command -v magick >/dev/null; then
  image_tool=(magick)
elif command -v convert >/dev/null; then
  image_tool=(convert)
else
  echo "ImageMagick (magick or convert) is required." >&2
  exit 1
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

rendered=0
current=0

render_source() {
  local source="$1"
  local relative="${source#"$source_dir"/}"
  local target="$output_dir/${relative%.*}.webp"

  if [[ "$force" != true && -f "$target" && ! "$source" -nt "$target" ]]; then
    current=$((current + 1))
    return
  fi

  mkdir -p "$(dirname "$target")"
  "${image_tool[@]}" "$source" -auto-orient -strip -resize '1600x1600>' -quality 78 "$target"
  rendered=$((rendered + 1))
}

bulk_dirs=()
for directory in "$source_dir"/[0-9][0-9][0-9][0-9]; do
  [[ -d "$directory" ]] && bulk_dirs+=("$directory")
done
[[ -d "$source_dir/cine" ]] && bulk_dirs+=("$source_dir/cine")

if (( ${#bulk_dirs[@]} > 0 )); then
  while IFS= read -r -d '' source; do
    render_source "$source"
  done < <(find "${bulk_dirs[@]}" -type f \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' \) -print0)
fi

# Only the curated Fotos edit needs portfolio-directory renditions. The archive
# already serves the year-directory copies, so this avoids publishing duplicates.
while IFS= read -r source; do
  render_source "$source"
done < <(ruby -ryaml -e '
  root = ARGV.fetch(0)
  data = YAML.load_file(ARGV.fetch(1)).fetch("photos")
  data.each do |photo|
    source = photo.fetch("src")
    next unless source.start_with?("/assets/img/portfolio/")
    puts File.join(root, source.delete_prefix("/assets/img/"))
  end
' "$source_dir" "$root/_data/portfolio.yml")

echo "Photo derivatives: ${rendered} rendered, ${current} already current."
