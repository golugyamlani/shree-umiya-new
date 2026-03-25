export async function compressImageToWebp(
    file: File, 
    suggestedName?: string, 
    index?: number, 
    quality: number = 0.9
): Promise<File> {
    // Return early if it's not an image
    if (!file.type.startsWith('image/')) {
        return file;
    }

    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;

                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Canvas context not available'));
                    return;
                }

                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            reject(new Error('Canvas to Blob conversion failed'));
                            return;
                        }

                        let newFilename = '';
                        if (suggestedName && suggestedName.trim().length > 0) {
                            // Convert "Luxury Hotel Towel!" to "luxury-hotel-towel"
                            const slug = suggestedName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                            const suffix = typeof index === 'number' ? `-${index + 1}` : '';
                            newFilename = `${slug}${suffix}.webp`;
                        } else {
                            // Fallback to exactly old behavior
                            const rawTitle = file.name.split('.').slice(0, -1).join('.') || 'image';
                            newFilename = `${rawTitle}.webp`;
                        }

                        const webpFile = new File([blob], newFilename, {
                            type: 'image/webp',
                            lastModified: Date.now(),
                        });

                        resolve(webpFile);
                    },
                    'image/webp',
                    quality
                );
            };

            img.onerror = (error) => reject(error);

            if (event.target?.result && typeof event.target.result === 'string') {
                img.src = event.target.result;
            } else {
                reject(new Error("Failed to load image source"));
            }
        };

        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
}
