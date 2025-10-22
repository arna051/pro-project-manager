
export function removeSudoPrompt(input: string) {
    if (typeof input !== 'string') return input;
    // Matches: [sudo] password for <anything-but-newline-or-colon>:
    // - case-insensitive
    // - allows extra spaces
    // - removes optional trailing newline
    const re = /\[sudo\]\s*password\s+for\s+[^:\r\n]+:\s*(?:\r?\n)?/gi;
    return input.replace(re, '');
}