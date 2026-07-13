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

case "${1:-}" in
  ""|--clean) ;;
  *)
    echo "Usage: $0 [--clean]" >&2
    exit 2
    ;;
esac

if [[ "${1:-}" == "--clean" && -d "$output_dir" ]]; then
  find "$output_dir" -type f -name '*.webp' -delete
fi

render_source() {
  local source="$1"
  local relative="${source#"$source_dir"/}"
  local target="$output_dir/${relative%.*}.webp"
  mkdir -p "$(dirname "$target")"
  "${image_tool[@]}" "$source" -auto-orient -strip -resize '1600x1600>' -quality 78 "$target"
}

while IFS= read -r -d '' source; do
  render_source "$source"
done < <(find "$source_dir/2022" "$source_dir/2023" "$source_dir/2024" -type f \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' \) -print0)

# Only the curated Fotos edit needs portfolio-directory renditions. The archive
# already serves the year-directory copies, so this avoids publishing duplicates.
ruby -ryaml -e '
  root = ARGV.fetch(0)
  data = YAML.load_file(ARGV.fetch(1)).fetch("photos")
  data.each do |photo|
    source = photo.fetch("src")
    next unless source.start_with?("/assets/img/portfolio/")
    puts File.join(root, source.delete_prefix("/assets/img/"))
  end
' "$source_dir" "$root/_data/portfolio.yml" |
  while IFS= read -r source; do
    render_source "$source"
  done
