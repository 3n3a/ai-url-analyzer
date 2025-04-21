export function isValidApiKey(authHeader: string | null, env: Env) {
    return !authHeader ||
        !authHeader.startsWith('Bearer ') ||
        authHeader.substring(7) !== env.API_KEY;
}