#!/usr/bin/env ruby
# frozen_string_literal: true

# Validate the human-authored photo metadata and generate the dimensions and
# responsive WebP paths consumed by Jekyll.

require 'date'
require 'open3'
require 'pathname'
require 'yaml'

VARIANT_WIDTHS = [640, 1200, 1920].freeze
PHOTO_EXTENSIONS = %w[.jpg .jpeg .png].freeze
PORTFOLIO_PLACEMENTS = %w[
  lead full feature left right inset-left inset-right ending
].freeze

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

def source_path(root, public_path)
  prefix = '/assets/img/'
  abort "Photo source must begin with #{prefix}: #{public_path}" unless public_path.start_with?(prefix)

  path = root.join(public_path.delete_prefix('/')).cleanpath
  image_root = root.join('assets', 'img').to_s + File::SEPARATOR
  abort "Photo source leaves assets/img: #{public_path}" unless path.to_s.start_with?(image_root)
  abort "Missing photo source: #{public_path}" unless path.file?
  abort "Unsupported photo extension: #{public_path}" unless PHOTO_EXTENSIONS.include?(path.extname.downcase)

  path
end

def photo_record(root, command, path)
  source_width, source_height = image_dimensions(command, path)
  widths = VARIANT_WIDTHS.map { |width| [width, source_width].min }.uniq
  relative = path.relative_path_from(root.join('assets', 'img')).to_s
  stem = relative.sub(/\.[^.]+\z/, '')

  variants = widths.map do |width|
    height = (source_height * width.fdiv(source_width)).round
    {
      'src' => "/assets/img/derived/#{stem}-#{width}w.webp",
      'width' => width,
      'height' => height
    }
  end

  largest = variants.last
  {
    'src' => largest.fetch('src'),
    'width' => largest.fetch('width'),
    'height' => largest.fetch('height'),
    'variants' => variants
  }
end

portfolio_path = root.join('_data', 'portfolio.yml')
portfolio_data = YAML.safe_load(portfolio_path.read, aliases: false) || {}
portfolio = portfolio_data.fetch('photos') { abort "Missing photos list in #{portfolio_path}" }
abort "#{portfolio_path} photos must be a list" unless portfolio.is_a?(Array)

seen_sequences = {}
seen_sources = {}
assets = {}

portfolio.each_with_index do |photo, index|
  label = "Portfolio entry #{index + 1}"
  %w[src sequence row placement alt].each do |field|
    abort "#{label} is missing #{field}" if photo[field].nil? || photo[field].to_s.strip.empty?
  end

  sequence = Integer(photo.fetch('sequence'), exception: false)
  row = Integer(photo.fetch('row'), exception: false)
  abort "#{label} has an invalid sequence" unless sequence&.positive?
  abort "#{label} has an invalid row" unless row&.positive?
  abort "Duplicate portfolio sequence: #{sequence}" if seen_sequences[sequence]
  abort "Duplicate portfolio source: #{photo.fetch('src')}" if seen_sources[photo.fetch('src')]
  abort "#{label} has an invalid placement: #{photo.fetch('placement')}" unless PORTFOLIO_PLACEMENTS.include?(photo.fetch('placement'))

  generated_fields = %w[width height layout] & photo.keys
  abort "#{label} contains generated or obsolete fields: #{generated_fields.join(', ')}" unless generated_fields.empty?

  source = photo.fetch('src')
  seen_sequences[sequence] = true
  seen_sources[source] = true
  assets[source] = photo_record(root, image_command, source_path(root, source))
end

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

generated = YAML.dump({ 'assets' => assets, 'rolls' => rolls })

if check_only
  unless destination.file? && destination.read == generated
    warn 'Photo manifest is missing or stale. Run: ruby scripts/build-photo-manifest.rb'
    exit 1
  end
  puts "Photo manifest is current (#{assets.length} selected works, #{rolls.length} rolls)."
elsif !destination.file? || destination.read != generated
  temporary = Pathname.new("#{destination}.#{Process.pid}.tmp")
  temporary.write(generated)
  temporary.rename(destination)
  puts "Wrote #{destination.relative_path_from(root)} (#{assets.length} selected works, #{rolls.length} rolls)."
else
  puts "Photo manifest is already current (#{assets.length} selected works, #{rolls.length} rolls)."
end
