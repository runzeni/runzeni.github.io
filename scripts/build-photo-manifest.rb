#!/usr/bin/env ruby
# frozen_string_literal: true

# Validate photo sources and metadata, then generate the dimensions and direct
# source paths consumed by Jekyll.

require 'date'
require 'open3'
require 'pathname'
require 'yaml'

PHOTO_EXTENSIONS = %w[.jpg .jpeg .png].freeze

root = Pathname.new(__dir__).join('..').realpath
destination = root.join('_data', 'photos.yml')
check_only = ARGV == ['--check']

unless ARGV.empty? || check_only
  warn "Usage: #{File.basename($PROGRAM_NAME)} [--check]"
  exit 2
end

image_command = if system('command -v magick >/dev/null 2>&1')
                  ['magick']
                elsif system('command -v convert >/dev/null 2>&1')
                  ['convert']
                else
                  abort 'ImageMagick (magick or convert) is required to build the photo manifest.'
                end

def front_matter(path)
  match = path.read.match(/\A---\s*\n(.*?)\n---\s*(?:\n|\z)/m)
  abort "Missing YAML front matter in #{path}" unless match

  YAML.safe_load(match[1], permitted_classes: [Date], aliases: false) || {}
end

def image_dimensions(command, path)
  stdout, stderr, status = Open3.capture3(
    *command, path.to_s, '-auto-orient', '-format', '%w %h', 'info:'
  )
  abort "Could not inspect #{path}: #{stderr}" unless status.success?

  width, height = stdout.split.map(&:to_i)
  abort "Invalid dimensions for #{path}" unless width.positive? && height.positive?

  [width, height]
end

def photo_record(root, command, path)
  source_width, source_height = image_dimensions(command, path)
  {
    'src' => "/#{path.relative_path_from(root)}",
    'width' => source_width,
    'height' => source_height
  }
end

portfolio_dir = root.join('assets', 'img', 'portfolio')
abort "Missing portfolio directory: #{portfolio_dir}" unless portfolio_dir.directory?

portfolio_files = Dir[portfolio_dir.join('*').to_s].filter_map do |path_string|
  path = Pathname.new(path_string)
  next unless path.file? && PHOTO_EXTENSIONS.include?(path.extname.downcase)

  match = path.basename.to_s.match(/\Aportfolio-(\d{2,})\.(?:jpe?g|png)\z/i)
  abort "Portfolio image must be named portfolio-NN: #{path.basename}" unless match

  [match[1].to_i, path]
end
abort "No supported image files found in #{portfolio_dir}" if portfolio_files.empty?

duplicate = portfolio_files.map(&:first).tally.find { |_number, count| count > 1 }
abort "Duplicate portfolio number: #{duplicate.first}" if duplicate

portfolio = portfolio_files
  .sort_by(&:first)
  .map { |_number, path| photo_record(root, image_command, path) }

rolls = {}
seen_folders = {}

Dir[root.join('_photobook', '*.md').to_s].sort.each do |entry_path|
  entry = Pathname.new(entry_path)
  metadata = front_matter(entry)
  slug = entry.basename('.md').to_s

  %w[year camera location].each do |field|
    abort "Missing #{field} in #{entry}" if metadata[field].nil? || metadata[field].to_s.strip.empty?
  end

  year = metadata.fetch('year').to_s
  abort "Invalid year in #{entry}: #{year}" unless year.match?(/\A\d{4}\z/)

  folder = metadata.fetch('folder', slug).to_s
  source_dir = root.join('assets', 'img', year, folder).cleanpath
  image_root = root.join('assets', 'img').to_s + File::SEPARATOR
  abort "Roll folder leaves assets/img: #{entry}" unless source_dir.to_s.start_with?(image_root)
  abort "Missing image directory for #{slug}: #{source_dir}" unless source_dir.directory?
  abort "Duplicate roll folder: #{source_dir}" if seen_folders[source_dir]

  deprecated = %w[title date image_dir slug] & metadata.keys
  abort "#{entry} contains obsolete metadata: #{deprecated.join(', ')}" unless deprecated.empty?

  photos = Dir[source_dir.join('**', '*').to_s].sort.each_with_object([]) do |path_string, result|
    path = Pathname.new(path_string)
    next unless path.file? && PHOTO_EXTENSIONS.include?(path.extname.downcase)

    result << photo_record(root, image_command, path)
  end
  abort "No supported image files found for #{slug}" if photos.empty?

  seen_folders[source_dir] = true
  rolls[slug] = { 'photos' => photos }
end

generated = YAML.dump({ 'portfolio' => portfolio, 'rolls' => rolls })

if check_only
  unless destination.file? && destination.read == generated
    warn 'Photo manifest is missing or stale. Run: ruby scripts/build-photo-manifest.rb'
    exit 1
  end
  puts "Photo manifest is current (#{portfolio.length} selected works, #{rolls.length} rolls)."
elsif !destination.file? || destination.read != generated
  temporary = Pathname.new("#{destination}.#{Process.pid}.tmp")
  temporary.write(generated)
  temporary.rename(destination)
  puts "Wrote #{destination.relative_path_from(root)} (#{portfolio.length} selected works, #{rolls.length} rolls)."
else
  puts "Photo manifest is already current (#{portfolio.length} selected works, #{rolls.length} rolls)."
end
