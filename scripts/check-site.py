#!/usr/bin/env python3
"""Check generated local links, fragments, assets, redirects, IDs, and image alt.

Usage: python3 scripts/check-site.py [_site] [--baseurl /subpath]
External URLs are deliberately not fetched. No third-party packages required.
"""
import argparse
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
import re
import sys
from urllib.parse import unquote, urljoin, urlsplit


class Page(HTMLParser):
    def __init__(self, path):
        super().__init__(convert_charrefs=True)
        self.path, self.ids, self.links, self.errors = path, [], [], []
        self.feed(path.read_text())

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if attrs.get('id'):
            self.ids.append(attrs['id'])
        if tag == 'img' and 'alt' not in attrs:
            self.errors.append('image missing alt attribute')
        for attr in ('href', 'src', 'poster'):
            if attrs.get(attr):
                self.links.append(attrs[attr])
        if attrs.get('data-locus-url'):
            self.links.append(attrs['data-locus-url'])
        if tag == 'meta' and attrs.get('http-equiv', '').lower() == 'refresh':
            match = re.search(r'url\s*=\s*(.+)', attrs.get('content', ''), re.I)
            if match:
                self.links.append(match[1].strip('"\''))
        if tag == 'img' and attrs.get('srcset'):
            self.links.extend(item.strip().split()[0] for item in attrs['srcset'].split(',') if item.strip())


def check(root, baseurl=''):
    root = root.resolve()
    pages = {path: Page(path) for path in root.rglob('*.html')}
    errors = []
    baseurl = '/' + baseurl.strip('/') if baseurl.strip('/') else ''

    def reference(source, link):
        parsed = urlsplit(link)
        if parsed.scheme or parsed.netloc or not link:
            return
        source_url = baseurl + '/' + source.relative_to(root).as_posix()
        resolved = urlsplit(urljoin(source_url, link))
        public_path = unquote(resolved.path)
        if baseurl:
            if not public_path.startswith(baseurl + '/'):
                errors.append(f'{source.relative_to(root)}: URL escapes baseurl: {link}')
                return
            public_path = public_path[len(baseurl):]
        target = (root / public_path.lstrip('/')).resolve()
        if not target.is_relative_to(root):
            errors.append(f'{source.relative_to(root)}: URL leaves output: {link}')
            return
        if target.is_dir():
            target /= 'index.html'
        if not target.is_file():
            errors.append(f'{source.relative_to(root)}: missing target: {link}')
        elif resolved.fragment and target in pages:
            fragment = unquote(resolved.fragment).split(':~:text=')[0]
            if fragment and fragment not in pages[target].ids:
                errors.append(f'{source.relative_to(root)}: missing fragment: {link}')

    if not pages:
        errors.append('No generated HTML pages found')
    for path, page in pages.items():
        errors.extend(f'{path.relative_to(root)}: {error}' for error in page.errors)
        errors.extend(f'{path.relative_to(root)}: duplicate id: {key}' for key, count in Counter(page.ids).items() if count > 1)
        for link in page.links:
            reference(path, link)
    for path in root.rglob('*.css'):
        for link in re.findall(r'url\(\s*[\'\"]?([^\)\'\"]+)', path.read_text()):
            if not link.startswith('#'):
                reference(path, link.strip())
    for path in (path for path in (root / 'assets' / 'js').iterdir() if path.suffix in ('.js', '.mjs')):
        for link in re.findall(r'(?:\bfrom\s*|\bimport\s*\(\s*)[\'\"]([^\'\"]+)', path.read_text()):
            reference(path, link)
    return len(pages), sorted(set(errors))


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('directory', nargs='?', default='_site', type=Path)
    parser.add_argument('--baseurl', default='')
    args = parser.parse_args()
    count, errors = check(args.directory, args.baseurl)
    if errors:
        print('\n'.join(errors), file=sys.stderr)
        sys.exit(1)
    print(f'Checked {count} HTML pages: local links, fragments, assets, redirects, IDs, and image alt passed.')
