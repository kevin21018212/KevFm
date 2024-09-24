import { NextResponse } from "next/server";
import { getRecentMoods } from "@/utils/fetch/getRecentMoods";

export async function GET() {
  try {
    const moodData = await getRecentMoods();
    if (!moodData) {
      return NextResponse.json({ error: "Failed to retrieve moods" }, { status: 500 });
    }

    return NextResponse.json(moodData);
  } catch (error: unknown) {
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
