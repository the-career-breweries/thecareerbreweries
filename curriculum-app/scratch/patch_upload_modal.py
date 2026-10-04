import re

file_path = r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the signature of AssetUploadModal
content = re.sub(
    r'const AssetUploadModal = \(\{ isOpen, onClose, onSnippetGenerated \}: \{ isOpen: boolean, onClose: \(\) => void, onSnippetGenerated: \(snippet: string\) => void \}\) => \{',
    'const AssetUploadModal = ({ isOpen, onClose, onSlidesGenerated }: { isOpen: boolean, onClose: () => void, onSlidesGenerated: (slides: string[]) => void }) => {',
    content
)

# Replace the states
old_states = """  const [assetType, setAssetType] = useState<'image' | 'video' | 'gif' | 'other' | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);"""

new_states = """  const [assetType, setAssetType] = useState<'image' | 'video' | 'gif' | 'other' | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [assetsPerSlide, setAssetsPerSlide] = useState<number>(1);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);"""

content = content.replace(old_states, new_states)

# Replace handleReset
old_reset = """  const handleReset = () => {
    setAssetType(null);
    setFile(null);
    setUploadedUrl(null);
  };"""

new_reset = """  const handleReset = () => {
    setAssetType(null);
    setFiles([]);
    setUploadedUrls([]);
  };"""

content = content.replace(old_reset, new_reset)

# Replace handleFileChange
old_file_change = """  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };"""

new_file_change = """  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(Array.from(e.target.files));
    }
  };"""

content = content.replace(old_file_change, new_file_change)

# Replace handleUpload
old_upload = """  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'lywlehez');

    try {
      // For images, gifs, and other docs, use image upload endpoint. For videos use video.
      const resourceType = assetType === 'video' ? 'video' : 'image';
      const response = await fetch(`https://api.cloudinary.com/v1_1/l4eozknq/${resourceType}/upload`, {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      if (data.secure_url) {
          setUploadedUrl(data.secure_url);
          const snippet = assetType === 'video' ? `<!-- CINEMA_CLIFFHANGER: ${data.secure_url} -->` : assetType === 'image' ? `<!-- CINEMATIC_BG: ${data.secure_url} -->` : `![Activity Asset](${data.secure_url})`;
          onSnippetGenerated(snippet);
        } else {
        alert("Upload failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to Cloudinary.");
    } finally {
      setUploading(false);
    }
  };"""

new_upload = """  const handleUpload = async () => {
    if (files.length === 0) return;
    setUploading(true);
    
    const urls = [];
    const resourceType = assetType === 'video' ? 'video' : 'image';
    
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'lywlehez');
        
        const response = await fetch(`https://api.cloudinary.com/v1_1/l4eozknq/${resourceType}/upload`, {
          method: 'POST',
          body: formData
        });
        
        const data = await response.json();
        if (data.secure_url) {
            urls.push(data.secure_url);
        } else {
            alert(`Upload failed for ${file.name}`);
        }
      }
      
      setUploadedUrls(urls);
      
      const chunks = [];
      for (let i = 0; i < urls.length; i += assetsPerSlide) {
          chunks.push(urls.slice(i, i + assetsPerSlide));
      }
      
      const newSlides = chunks.map(chunk => {
          return chunk.map(url => {
              return assetType === 'video' ? `<!-- CINEMA_CLIFFHANGER: ${url} -->` : assetType === 'image' ? `<!-- CINEMATIC_BG: ${url} -->` : `![Activity Asset](${url})`;
          }).join('\\n\\n');
      });
      
      onSlidesGenerated(newSlides);
      
    } catch (err) {
      console.error(err);
      alert("Error connecting to Cloudinary.");
    } finally {
      setUploading(false);
    }
  };"""

content = content.replace(old_upload, new_upload)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
