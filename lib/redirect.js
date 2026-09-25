// [REAL CODE] Deployed by GitHub Actions (NOT by CDK).
// This represents the customer-managed real implementation of the CloudFront Function.
// The verification checks that this code survives subsequent CDK re-deployments
// (i.e., CDK does not overwrite it back to the placeholder).
function handler(event) {
  var request = event.request;
  var uri = request.uri;

  // Example: redirect /old-path to /new-path with 301.
  if (uri === '/old-path') {
    return {
      statusCode: 301,
      statusDescription: 'Moved Permanently',
      headers: {
        location: { value: '/new-path' },
      },
    };
  }

  return request;
}
