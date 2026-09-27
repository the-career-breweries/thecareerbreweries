import re

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\ThemeSelector.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

new_themes = """      {
        id: 'classic' as AppTheme,
        name: 'Classic Studio',
        logoComponent: <TcbClassicLogo isHovered={hoveredTheme === 'classic'} />,
        color: '#2563eb',
        // Office / Interview space
        bg: 'linear-gradient(to bottom, rgba(243,244,246,0) 0%, rgba(243,244,246,1) 100%), url("https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=2069&auto=format&fit=crop")',
      },
      {
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

content = content.replace("""      {
        id: 'classic' as AppTheme,
        name: 'Classic Studio',
        logoComponent: <TcbClassicLogo isHovered={hoveredTheme === 'classic'} />,
        color: '#2563eb',
        // Office / Interview space
        bg: 'linear-gradient(to bottom, rgba(243,244,246,0) 0%, rgba(243,244,246,1) 100%), url("https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=2069&auto=format&fit=crop")',
      }
    ];""", new_themes)

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\ThemeSelector.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

