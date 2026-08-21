#!/usr/bin/env ruby
# frozen_string_literal: true

require "json"
require "nokogiri"
require "pathname"
require "set"
require "uri"

SITE_ORIGIN = "https://andimsewon.github.io"
SITE_DIR = Pathname(ARGV.find { |arg| !arg.start_with?("--") } || "_site").expand_path
MANIFEST_PATH = Pathname("docs/seo-page-manifest.md").expand_path
PLACEHOLDERS = /(?:YOUR_[A-Z0-9_]+|TODO|example\.com)/i

errors = []
pages = {}

def output_path_for(url)
  path = URI(url).path
  return "index.html" if path == "/"
  return "#{path.delete_prefix("/")}index.html" if path.end_with?("/")

  path.delete_prefix("/")
end

def primary_intent(url)
  path = URI(url).path
  return "Official identity, AI and software engineering profile" if ["/", "/ko/"].include?(path)
  return "Research experience and methods" if path.end_with?("research.html")
  return "Publications and research outputs" if path.end_with?("publications.html")
  return "AI, data and IoT project portfolio" if path.end_with?("projects.html")
  return "Professional and academic activities" if path.end_with?("activities.html")
  return "Verified awards and certificates" if path.end_with?("awards.html")
  return "Research and project photography" if path.end_with?("gallery.html")
  return "Technical writing" if path.end_with?("writing.html")
  return "ATIO knowledge-base UX and data analysis" if path.include?("atio-")
  return "Knowledge-graph RAG and multi-hop reasoning" if path.include?("kg-rag")
  return "LoRa and MQTT beehive monitoring research" if path.include?("waggle-net")
  return "Computer-vision heritage damage detection" if path.include?("heritage-")
  return "AI urban air-impact analysis project" if path.include?("gaia-")
  return "Computer-vision crop quality project" if path.include?("guardians-")
  return "AI interactive storytelling project" if path.include?("sangsang-")

  "Portfolio content"
end

def json_urls(value, result = [])
  case value
  when Hash
    value.each_value { |child| json_urls(child, result) }
  when Array
    value.each { |child| json_urls(child, result) }
  when String
    result << value if value.match?(%r{\Ahttps?://})
  end
  result
end

Dir.glob(SITE_DIR.join("**/*.html")).sort.each do |filename|
  document = Nokogiri::HTML(File.read(filename))
  canonical_nodes = document.css('link[rel="canonical"]')
  next if canonical_nodes.empty? # 404 and deliberately non-indexable utility documents

  relative = Pathname(filename).relative_path_from(SITE_DIR).to_s
  titles = document.css("title")
  h1s = document.css("h1")
  descriptions = document.css('meta[name="description"]')
  canonicals = canonical_nodes.map { |node| node["href"].to_s.strip }
  canonical = canonicals.first

  errors << "#{relative}: expected one non-empty title" unless titles.length == 1 && !titles.first.text.strip.empty?
  errors << "#{relative}: expected one non-empty H1" unless h1s.length == 1 && !h1s.first.text.strip.empty?
  errors << "#{relative}: expected one non-empty meta description" unless descriptions.length == 1 && !descriptions.first["content"].to_s.strip.empty?
  errors << "#{relative}: expected one canonical" unless canonicals.length == 1
  errors << "#{relative}: canonical must be absolute HTTPS on #{SITE_ORIGIN}" unless canonical&.start_with?("#{SITE_ORIGIN}/")
  errors << "#{relative}: canonical does not match output route (#{canonical})" unless canonical && output_path_for(canonical) == relative
  errors << "#{relative}: contains noindex" if document.css('meta[name="robots"]').any? { |node| node["content"].to_s.match?(/noindex/i) }
  errors << "#{relative}: contains unintended nofollow" if document.css('meta[name="robots"]').any? { |node| node["content"].to_s.match?(/nofollow/i) }

  alternates = document.css('link[rel="alternate"][hreflang]').to_h { |node| [node["hreflang"], node["href"]] }
  %w[en ko x-default].each { |lang| errors << "#{relative}: missing #{lang} hreflang" unless alternates[lang] }
  alternates.each do |lang, url|
    errors << "#{relative}: #{lang} hreflang must be absolute HTTPS" unless url&.start_with?("#{SITE_ORIGIN}/")
  end

  document.css('script[type="application/ld+json"]').each_with_index do |node, index|
    begin
      data = JSON.parse(node.text)
      json_urls(data).each { |url| errors << "#{relative}: structured-data URL is not HTTPS: #{url}" unless url.start_with?("https://") }
    rescue JSON::ParserError => e
      errors << "#{relative}: JSON-LD #{index + 1} is invalid (#{e.message})"
    end
  end

  document.css("img").each do |image|
    errors << "#{relative}: image #{image['src']} is missing alt" if image["alt"].nil?
    # Empty alt is the HTML-native marker for a decorative image. Dynamic lightbox
    # targets have no initial src and therefore no intrinsic production image yet.
    errors << "#{relative}: content image #{image['src']} lacks explicit dimensions" if !image["src"].to_s.empty? && (!image["width"] || !image["height"])
  end

  metadata = document.at_css("head")&.text.to_s + document.css('head meta, head link, script[type="application/ld+json"]').map(&:to_s).join
  errors << "#{relative}: placeholder token remains in production metadata" if metadata.match?(PLACEHOLDERS)

  pages[canonical] = {
    file: relative,
    title: titles.first&.text&.strip,
    h1: h1s.first&.text&.strip&.gsub(/\s+/, " "),
    description: descriptions.first&.[]("content")&.strip,
    canonical: canonical,
    alternates: alternates,
    document: document
  }
end

descriptions = pages.values.group_by { |page| page[:description] }
descriptions.each { |description, matches| errors << "duplicate description on #{matches.map { |page| page[:file] }.join(', ')}: #{description}" if description && matches.length > 1 }

pages.each do |url, page|
  %w[en ko].each do |lang|
    alternate_url = page[:alternates][lang]
    target = pages[alternate_url]
    if target.nil?
      errors << "#{page[:file]}: #{lang} hreflang target is not canonical/indexable: #{alternate_url}"
      next
    end
    reciprocal = page[:alternates]["en"] == url ? "en" : "ko"
    errors << "#{page[:file]}: hreflang is not reciprocal with #{target[:file]}" unless target[:alternates][reciprocal] == url
  end

  page[:document].css("a[href]").each do |anchor|
    href = anchor["href"].to_s.strip
    next if href.empty? || href.start_with?("#", "mailto:", "tel:", "javascript:")
    begin
      resolved = URI.join("#{SITE_ORIGIN}/", href)
    rescue URI::InvalidURIError
      errors << "#{page[:file]}: invalid link #{href}"
      next
    end
    next unless resolved.host == "andimsewon.github.io"
    target_path = resolved.path
    target_path = "/index.html" if target_path == "/"
    target_path += "index.html" if target_path.end_with?("/")
    local_target = SITE_DIR.join(target_path.delete_prefix("/"))
    errors << "#{page[:file]}: unresolved internal link #{href}" unless local_target.file?
  end
end

sitemap_file = SITE_DIR.join("sitemap.xml")
if sitemap_file.file?
  sitemap = Nokogiri::XML(sitemap_file.read)
  sitemap.remove_namespaces!
  sitemap_urls = sitemap.css("url > loc").map { |node| node.text.strip }
  errors << "sitemap.xml contains duplicate URLs" unless sitemap_urls.uniq.length == sitemap_urls.length
  (sitemap_urls - pages.keys).each { |url| errors << "sitemap.xml contains non-canonical or unresolved URL: #{url}" }
  (pages.keys - sitemap_urls).each { |url| errors << "canonical page missing from sitemap.xml: #{url}" }
  errors << "sitemap.xml must not use ignored priority/changefreq fields" if sitemap.at_css("priority, changefreq")
else
  errors << "sitemap.xml was not generated"
end

%w[https://andimsewon.github.io/ https://andimsewon.github.io/ko/].each do |url|
  page = pages[url]
  next unless page
  schema = JSON.parse(page[:document].at_css('script[type="application/ld+json"]').text)
  person = schema["mainEntity"]
  errors << "#{page[:file]}: homepage JSON-LD must be ProfilePage" unless schema["@type"] == "ProfilePage"
  errors << "#{page[:file]}: stable Person @id is missing" unless person&.fetch("@id", nil) == "#{SITE_ORIGIN}/#sewon-kim"
  errors << "#{page[:file]}: expected all verified alternate names" unless person&.fetch("alternateName", nil) == ["김세원", "Kim Sewon", "andimsewon"]
  errors << "#{page[:file]}: current relationships must use affiliation, not alumniOf" if person&.key?("alumniOf") || !person&.key?("affiliation")
  visible = page[:document].at_css("body").text.gsub(/\s+/, " ")
  ["Sewon Kim", "김세원", "andimsewon"].each { |name| errors << "#{page[:file]}: structured identity #{name} is not visible" unless visible.include?(name) }
end

manifest_lines = [
  "# SEO page metadata manifest",
  "",
  "Generated from the production Jekyll build by `scripts/validate_seo.rb`. All listed pages are canonical and indexable.",
  "",
  "| URL | Primary intent | Unique title | H1 | Meta description | Canonical | Hreflang pair | Indexable |",
  "|---|---|---|---|---|---|---|---|"
]
pages.keys.sort.each do |url|
  page = pages[url]
  escape = ->(value) { value.to_s.gsub("|", "\\|").gsub(/\s+/, " ") }
  pair = "en: #{page[:alternates]['en']}; ko: #{page[:alternates]['ko']}; x-default: #{page[:alternates]['x-default']}"
  manifest_lines << "| #{url} | #{primary_intent(url)} | #{escape.call(page[:title])} | #{escape.call(page[:h1])} | #{escape.call(page[:description])} | #{page[:canonical]} | #{pair} | Yes |"
end
manifest = manifest_lines.join("\n") + "\n"

if ARGV.include?("--write-manifest")
  MANIFEST_PATH.dirname.mkpath
  MANIFEST_PATH.write(manifest)
elsif MANIFEST_PATH.file? && MANIFEST_PATH.read != manifest
  errors << "docs/seo-page-manifest.md is stale; run scripts/validate_seo.rb --write-manifest"
elsif !MANIFEST_PATH.file?
  errors << "docs/seo-page-manifest.md is missing; run scripts/validate_seo.rb --write-manifest"
end

if errors.empty?
  puts "SEO validation passed: #{pages.length} canonical pages, #{pages.length / 2} reciprocal language pairs, all internal links resolved."
  exit 0
end

warn "SEO validation failed with #{errors.length} error(s):"
errors.each { |error| warn "- #{error}" }
exit 1
