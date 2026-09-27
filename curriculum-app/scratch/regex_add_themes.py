import re

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\ThemeSelector.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

new_themes = """      {
        id: 'youtube' as AppTheme,
        name: 'FlyTube',
        logoComponent: <FlyTubeLogo isHovered={hoveredTheme === 'youtube'} />,
        color: '#ff0000',
        bg: 'linear-gradient(to bottom, rgba(15,15,15,0) 0%, rgba(15,15,15,1) 100%), url("https://images.unsplash.com/photo-1542296332-2e4473faf563?q=80&w=2070&auto=format&fit=crop")',
      },
      {
        id: 'game' as AppTheme,
        name: "Let's Game It!",
        logoComponent: <LetsGameItLogo isHovered={hoveredTheme === 'game'} />,
        color: '#9146FF',
        bg: 'linear-gradient(to bottom, rgba(24,24,27,0) 0%, rgba(24,24,27,1) 100%), url("https://images.unsplash.com/photo-1538681105587-85640961bf8b?q=80&w=2070&auto=format&fit=crop")',
      }
    ];"""

content = re.sub(r"      \}\n    \];", "      },\n" + new_themes, content)

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\ThemeSelector.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
