# frozen_string_literal: true

module Jekyll
  class RedirectPage < PageWithoutAFile
    def initialize(site, from, to)
      path = from.sub(%r{\A/}, '')
      directory = path.end_with?('/') ? path : File.dirname(path)
      name = path.end_with?('/') ? 'index.html' : File.basename(path)

      super(site, site.source, directory, name)
      self.content = ''
      self.data = {
        'layout' => 'redirect',
        'permalink' => from,
        'redirect_to' => to,
        'sitemap' => false
      }
    end
  end

  class RedirectGenerator < Generator
    safe true
    priority :low

    def generate(site)
      Array(site.data['redirects']).each do |redirect|
        site.pages << RedirectPage.new(site, redirect.fetch('from'), redirect.fetch('to'))
      end
    end
  end
end
