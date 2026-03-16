import { NextResponse } from "next/server";

type ContactRequest = {
  name: string;
  email: string;
  message: string;
};

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
