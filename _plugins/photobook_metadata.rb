# frozen_string_literal: true

# Derive presentation metadata from the small human-authored roll records.
module Jekyll
  class PhotobookMetadataGenerator < Generator
    safe true
    priority :high

    def generate(site)
      site.collections.fetch('photobook').docs.each do |document|
        data = document.data
        film = data.fetch('film', '').to_s.strip
        film = 'Digital' if film.empty?
        location = data.fetch('location', '').to_s.strip

        data['film'] = film
        data['title'] = [film, location].reject(&:empty?).join(' / ')
        data['description'] ||= [
          "#{film} photographs from #{location}",
          data['year'],
          data['camera']
        ].compact.join(' · ')
      end
    end
  end
end
