export interface StoryblokWebhook {
  text: string;
  action: string;
  space_id: number;
  story_id: number;
}

export interface CreateStoryRequest<Content = any> {
  name: string;
  slug: string;
  content: Content;
}

export interface UpdateStoryRequest<Content = any> {
  name: string;
  slug: string;
  content: Content;
}

export interface Content {
  component: string;
  body: Dish | any;
}

export interface Dish {
  sku: string;
  _uid: string;
  price: string;
  kitchen: string;
  component: string;
  product_id: string;
  description: string;
  ingredients: string[];
  out_of_stock: boolean;
  ingredient_list: any[];
}

export function collectionType(componentName: string): string | null {
  let collectionType: string | null = null;
  switch (componentName) {
    case "kitchen":
      collectionType = "kitchens";
      break;
  }
  return collectionType;
}
