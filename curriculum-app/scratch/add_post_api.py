import re

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\app\api\lesson\route.ts', 'r', encoding='utf-8') as f:
    content = f.read()

post_code = """
export async function POST(request: Request) {
  try {
    const { program, stream, semester, week, course, content } = await request.json();

    if (!program || !stream || !semester || !week || content === undefined) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    let safeStream = stream.replace(/\./g, '').replace(/\s+/g, '-');
    if (program === 'ug' && parseInt(semester) >= 1 && parseInt(semester) <= 4) {
      if (!safeStream.includes('aviation')) {
        safeStream = 'shared';
      }
    }
    
    const baseFolder = course === 'english' ? 'english-lessons' : (course === 'computing-skills' ? 'computing-skills' : 'lessons');

    const filePath = path.join(
      process.cwd(),
      'src',
      'content',
      baseFolder,
      program,
      safeStream,
      `sem${semester}`,
      `week${week}.md`
    );

    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, content, 'utf8');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to save lesson:', error);
    return NextResponse.json({ error: 'Failed to save lesson' }, { status: 500 });
  }
}
"""

content = content + "\n" + post_code

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\app\api\lesson\route.ts', 'w', encoding='utf-8') as f:
    f.write(content)
