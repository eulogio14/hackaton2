const IMAGES = [
  'https://i.pinimg.com/originals/8e/9f/a0/8e9fa0b1c2d3e4f5a6b7c8d9e0f1a2b3.jpg',
  'https://i.pinimg.com/originals/7d/8c/9b/7d8c9b0a1f2e3d4c5b6a7f8e9d0c1b2a.jpg',
  'https://i.pinimg.com/originals/6c/7b/8a/6c7b8a9f0e1d2c3b4a5f6e7d8c9b0a1f.jpg',
  'https://i.pinimg.com/originals/5b/6a/7f/5b6a7f8e9d0c1b2a3f4e5d6c7b8a9f0e.jpg',
  'https://i.pinimg.com/originals/4a/5f/6e/4a5f6e7d8c9b0a1f2e3d4c5b6a7f8e9d.jpg',
  'https://i.pinimg.com/originals/3f/4e/5d/3f4e5d6c7b8a9f0e1d2c3b4a5f6e7d8c.jpg',
];

export function getOnePieceImage(id: string): string {
  let hash = 0;
  const s = String(id || '0');
  for (let i = 0; i < s.length; i++) {
    hash = (hash * 131542391 + s.charCodeAt(i)) % IMAGES.length;
  }
  return IMAGES[hash];
}
