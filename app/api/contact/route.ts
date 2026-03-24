import { NextResponse } from "next/server";

type ContactRequest = {
  name: string;
  email: string;
  message: string;
};

export async function GET() {
  const data = {
    workshops: [
      { name: "Database Workshop", email: "robert@example.com", message: "I'm interested in learning more about database design." },
      { name: "API Integration", email: "yazan@example.com", message: "Can you provide more details about API integration?" },
      { name: "Next.js Fundamentals", email: "jason@example.com", message: "I'd like to attend the Next.js fundamentals workshop." },
    ],
  };
  // eslint-disable-next-line no-console
  console.log("GET /api/contact - Returning data:", data);
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<ContactRequest>;

  const name = body.name?.trim();
  const email = body.email?.trim();
  const message = body.message?.trim();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "name, email, and message are required" }, { status: 400 });
  }

  // TODO: Wire this up to email, database, or another backend service.
  // For now, we just log it to the server console.
  // eslint-disable-next-line no-console
  console.log("Contact form submission", { name, email, message });

  return NextResponse.json({ success: true });
}
