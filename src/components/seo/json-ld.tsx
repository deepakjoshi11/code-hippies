export function JsonLd({ json }: { json: string }) {
  return (
    <script
      type="application/ld+json"
      // Serialised by graph() from trusted, build-time data only.
      dangerouslySetInnerHTML={{ __html: json.replace(/</g, "\\u003c") }}
    />
  );
}
