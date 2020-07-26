export default async function preview(req, res) {
  // Check the secret and next parameters
  // This secret should only be known to this API route and the CMS
  if (
    req.query.secret !== process.env.SANITY_PREVIEW_SECRET ||
    !req.query.slug
  ) {
    return res.status(401).json({ message: "Invalid token" });
  }

  // Enable Preview Mode by setting the cookies
  res.setPreviewData({});

  // Redirect to the path from the fetched document
  if (req.query.type === "post") {
    res.writeHead(307, {
      Location: `/blog/${req.query.slug}`
    });
  }
  if (req.query.type === "job") {
    res.writeHead(307, {
      Location: `/jobs/${req.query.slug}`
    });
  }
  if (req.query.type === "page") {
    res.writeHead(307, {
      Location: `/${req.query.slug}`
    });
  }

  res.end();
}
