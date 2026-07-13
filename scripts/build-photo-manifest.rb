#!/usr/bin/env ruby
# frozen_string_literal: true

# Build the Jekyll data used by full film-roll pages. Jekyll excludes the
# original scans from the public artifact, so layouts must never discover them
# through site.static_files at render time.

require 'open3'
require 'pathname'
require 'yaml'
require 'date'

root = Pathname.new(__dir__).join('..').realpath
destination = root.join('_data', 'photobooks.yml')
check_only = ARGV == ['--check']

unless ARGV.empty? || check_only
  warn "Usage: #{File.basename($PROGRAM_NAME)} [--check]"
  exit 2
end

identify_command = if system('command -v identify >/dev/null 2>&1')
                     ['identify']
                   elsif system('command -v magick >/dev/null 2>&1')
                     ['magick', 'identify']
                   else
                     abort 'ImageMagick (identify or magick) is required to build the photo manifest.'
                   end

def front_matter(path)
  match = path.read.match(/\A---\s*\n(.*?)\n---\s*(?:\n|\z)/m)
  abort "Missing YAML front matter in #{path}" unless match

  YAML.safe_load(match[1], permitted_classes: [Date], aliases: false) || {}
end

def image_dimensions(command, path)
  stdout, stderr, status = Open3.capture3(*command, '-format', '%w %h', path.to_s)
  abort "Could not inspect #{path}: #{stderr}" unless status.success?

  width, height = stdout.split.map(&:to_i)
  abort "Invalid dimensions for #{path}" unless width.positive? && height.positive?

  [width, height]
end

extensions = %w[.jpg .jpeg .png].freeze
rolls = {}

Dir[root.join('_photobook', '*.md').to_s].sort.each do |entry_path|
  entry = Pathname.new(entry_path)
  metadata = front_matter(entry)
  %w[slug year image_dir].each do |key|
    abort "Missing #{key} in #{entry}" if metadata[key].nil? || metadata[key].to_s.empty?
  end

  slug = metadata.fetch('slug').to_s
  abort "Duplicate photobook slug: #{slug}" if rolls.key?(slug)

  source_dir = root.join('assets', 'img', metadata.fetch('year').to_s, metadata.fetch('image_dir').to_s)
  abort "Missing image directory for #{slug}: #{source_dir}" unless source_dir.directory?

  photos = Dir[source_dir.join('**', '*').to_s].sort.each_with_object([]) do |path_string, result|
    path = Pathname.new(path_string)
    next unless path.file? && extensions.include?(path.extname.downcase)

    width, height = image_dimensions(identify_command, path)
    relative = path.relative_path_from(root.join('assets', 'img')).to_s
    result << {
      'src' => "/assets/img/derived/#{relative.sub(/\.[^.]+\z/, '.webp')}",
      'width' => width,
      'height' => height
    }
  end
  abort "No supported image files found for #{slug}" if photos.empty?

  rolls[slug] = { 'photos' => photos }
end

generated = YAML.dump({ 'rolls' => rolls })

if check_only
  unless destination.file? && destination.read == generated
    warn 'Photo manifest is missing or stale. Run: ruby scripts/build-photo-manifest.rb'
    exit 1
  end
  puts "Photo manifest is current (#{rolls.length} rolls)."
elsif !destination.file? || destination.read != generated
  temporary = Pathname.new("#{destination}.#{Process.pid}.tmp")
  temporary.write(generated)
  temporary.rename(destination)
  puts "Wrote #{destination.relative_path_from(root)} (#{rolls.length} rolls)."
else
  puts "Photo manifest is already current (#{rolls.length} rolls)."
end
