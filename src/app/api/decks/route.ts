import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const decksDir = path.join(process.cwd(), 'public', 'decks');
    const files = fs.readdirSync(decksDir);
    const jsonFiles = files.filter(file => file.endsWith('.json'));
    return NextResponse.json(jsonFiles);
  } catch (error) {
    console.error('Error reading decks directory:', error);
    return NextResponse.json({ error: 'Failed to read decks' }, { status: 500 });
  }
}