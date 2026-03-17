const codespaceName = process.env.REACT_APP_CODESPACE_NAME;

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  (codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api`
    : 'http://localhost:8000/api');

function getEndpointUrl(path) {
  const trimmedBase = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${trimmedBase}${normalizedPath}`;
}

export { API_BASE_URL, getEndpointUrl };
