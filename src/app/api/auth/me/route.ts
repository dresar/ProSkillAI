import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { extractUsernameFromEmail } from "@/lib/share-utils";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({
        authenticated: false,
        username: null,
        name: null,
      });
    }

    const username = extractUsernameFromEmail(user.email);

    return NextResponse.json({
      authenticated: true,
      username,
      name: user.name,
      role: user.role,
    });
  } catch {
    return NextResponse.json(
      { authenticated: false, username: null, name: null },
      { status: 500 }
    );
  }
}
