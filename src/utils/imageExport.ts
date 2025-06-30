import html2canvas from 'html2canvas';

export const downloadAsImage = async (
  elementId: string, 
  filename: string = 'shopshop-description',
  quality: 'low' | 'medium' | 'high' = 'high'
): Promise<void> => {
  const element = document.getElementById(elementId);
  if (!element) throw new Error('Element not found');

  // Set scale based on quality
  const scaleMap = {
    low: 1,
    medium: 1.5,
    high: 2
  };

  const canvas = await html2canvas(element, {
    backgroundColor: '#ffffff',
    scale: scaleMap[quality],
    logging: false,
    useCORS: true,
  });

  const link = document.createElement('a');
  link.download = `${filename}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
};