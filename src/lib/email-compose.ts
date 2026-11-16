export function emailBodyFromMarkdown(text: string) {
  return text
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, "$1: $2")
    .replace(/\*\*([^*]+)\*\*/g, "$1");
}

export function buildGmailComposeUrl(subject: string, body: string, emails: string[]) {
  const params = new URLSearchParams({
    view: "cm",
    fs: "1",
    bcc: emails.join(","),
    su: subject,
    body: emailBodyFromMarkdown(body),
  });
  return `https://mail.google.com/mail/?${params.toString()}`;
}

export function buildMailtoUrl(subject: string, body: string, emails: string[]) {
  const params = new URLSearchParams({
    bcc: emails.join(","),
    subject,
    body: emailBodyFromMarkdown(body),
  });
  return `mailto:?${params.toString()}`;
}
