import re

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add showToast state and effect
content = content.replace(
    "const [confettiActive, setConfettiActive] = useState(true);",
    "const [confettiActive, setConfettiActive] = useState(true);\n  const [showToast, setShowToast] = useState(false);\n  useEffect(() => {\n    if (currentSlide === slides.length - 1 && course === 'soft-skills') {\n      setShowToast(true);\n      const timer = setTimeout(() => setShowToast(false), 2500);\n      return () => clearTimeout(timer);\n    }\n  }, [currentSlide, slides.length, course]);"
)

# Update rendering condition
content = content.replace(
    "{!isLoading && slides.length > 0 && currentSlide === slides.length - 1 && course === 'soft-skills' && (",
    "{!isLoading && slides.length > 0 && currentSlide === slides.length - 1 && course === 'soft-skills' && showToast && ("
)

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
