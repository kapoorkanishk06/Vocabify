import data from './placeholder-images.json';

export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

export const PlaceHolderImages: ImagePlaceholder[] = data.placeholderImages;

export const getPlaceholderImage = (id: string) => {
    const image = PlaceHolderImages.find(img => img.id === id);
    return image?.imageUrl || '';
}
