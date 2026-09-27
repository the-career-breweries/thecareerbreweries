import re

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add isIdle state
idle_state_hook = """  const [isIdle, setIsIdle] = useState(false);
  
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const resetIdle = () => {
      setIsIdle(false);
      clearTimeout(timer);
      timer = setTimeout(() => setIsIdle(true), 2000);
    };
    
    window.addEventListener('mousemove', resetIdle);
    window.addEventListener('keydown', resetIdle);
    window.addEventListener('touchstart', resetIdle);
    
    resetIdle();
    
    return () => {
      window.removeEventListener('mousemove', resetIdle);
      window.removeEventListener('keydown', resetIdle);
      window.removeEventListener('touchstart', resetIdle);
      clearTimeout(timer);
    };
  }, []);"""

content = content.replace(
    "const [showToast, setShowToast] = useState(false);",
    "const [showToast, setShowToast] = useState(false);\n" + idle_state_hook
)

# Apply isIdle to Floating Top Right Controls
content = content.replace(
    """<div style={{ position: 'absolute', top: '2rem', right: '2rem', display: 'flex', gap: '1rem', zIndex: 10, alignItems: 'center' }}>""",
    """<div style={{ position: 'absolute', top: '2rem', right: '2rem', display: 'flex', gap: '1rem', zIndex: 10, alignItems: 'center', opacity: isIdle ? 0 : 1, transition: 'opacity 0.5s ease' }}>"""
)

# Apply isIdle to Video Scrubber Playbar
content = content.replace(
    """opacity: isScrolledDown ? 0 : 1,""",
    """opacity: isScrolledDown || isIdle ? 0 : 1,"""
)
content = content.replace(
    """transform: isScrolledDown ? 'translateY(100%)' : 'translateY(0)',""",
    """transform: isScrolledDown || isIdle ? 'translateY(100%)' : 'translateY(0)',"""
)

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
