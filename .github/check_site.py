"""Check the custom domain, sitemap, and internal links before Pages publishes."""

from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urljoin, urlsplit
from xml.etree import ElementTree


ROOT = Path(__file__).resolve().parents[1]
ORIGIN = "https://kinvow.org/"


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = set()
        self.links = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if attrs.get("id"):
            self.ids.add(attrs["id"])
        for key in ("href", "src", "action"):
            if attrs.get(key):
                self.links.append(attrs[key])


def main():
    errors = []
    for private_tooling in (".claude", ".mcp.json"):
        if (ROOT / private_tooling).exists():
            errors.append(f"Keep agent configuration out of the public Pages repository: {private_tooling}")
    if (ROOT / "CNAME").read_text().strip() != "kinvow.org":
        errors.append("CNAME must match the published domain")
    for required in ("index.html", "404.html", "robots.txt", "sitemap.xml", ".nojekyll"):
        if not (ROOT / required).is_file():
            errors.append(f"Missing {required}")

    pages = {}
    references = []
    for file in ROOT.rglob("*.html"):
        name = file.relative_to(ROOT).as_posix()
        if any(part.startswith(".") for part in file.relative_to(ROOT).parts):
            continue
        page = Page()
        page.feed(file.read_text(encoding="utf-8"))
        page.close()
        pages[name] = page
        references.extend((name, link) for link in page.links)

    sitemap = ROOT / "sitemap.xml"
    if sitemap.exists():
        if sitemap.stat().st_size > 5_000_000:
            raise SystemExit("Sitemap exceeds the size limit for this site")
        xml = sitemap.read_text(encoding="utf-8")
        if "<!DOCTYPE" in xml:
            raise SystemExit("Sitemap must not contain a DTD")
        locations = ElementTree.fromstring(xml).findall("{*}url/{*}loc")
        if not locations:
            errors.append("The sitemap has no page URLs")
        for location in locations:
            url = (location.text or "").strip()
            if not url.startswith(ORIGIN):
                errors.append(f"Noncanonical sitemap URL: {url}")
            references.append(("sitemap.xml", url))

    for source, raw in references:
        url = urlsplit(urljoin(urljoin(ORIGIN, source), raw))
        if url.scheme not in ("http", "https") or url.hostname not in ("kinvow.org", "www.kinvow.org"):
            continue
        target = (ROOT / unquote(url.path).lstrip("/")).resolve()
        if not target.is_relative_to(ROOT):
            errors.append(f"{source}: path escapes the site: {raw}")
            continue
        if target.is_dir():
            target = target / "index.html"
        if not target.is_file():
            errors.append(f"{source}: missing file: {raw}")
            continue
        page = pages.get(target.relative_to(ROOT).as_posix())
        if page and url.fragment and unquote(url.fragment) not in page.ids:
            errors.append(f"{source}: missing anchor: {raw}")

    if errors:
        raise SystemExit("\n".join(errors))
    print(f"Validated {len(pages)} pages and {len(references)} references")


if __name__ == "__main__":
    main()
