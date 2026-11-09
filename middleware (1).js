// Runs on Vercel before any file is served. Only people listed in the USERS
// environment variable (format: name1:password1,name2:password2) get in.
export default function middleware(request) {
  const users = (process.env.USERS || '').split(',').map((s) => s.trim()).filter(Boolean);
  const auth = request.headers.get('authorization') || '';
  if (auth.startsWith('Basic ')) {
    try {
      if (users.includes(atob(auth.slice(6)))) {
        // Allow the request to continue to the static file.
        return new Response(null, { headers: { 'x-middleware-next': '1' } });
      }
    } catch (e) {}
  }
  return new Response('Login required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Manglish PDF Converter", charset="UTF-8"' },
  });
}
