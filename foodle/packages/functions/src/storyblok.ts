import * as admin from "firebase-admin";
import {Story, StoryblokManagmentApiResult, StoryblokResult} from "storyblok-js-client";
import * as functions from "firebase-functions";

const StoryblokClient = require("storyblok-js-client")

const spaceId = functions.config().storyblok.space_id

const NodeCache = require( "node-cache" );

const myCache = new NodeCache( { checkperiod: 120, useClones: true } );
const cacheKey = 'StoryblokData'

export enum StoryType {
  dish
}

const storyblok = new StoryblokClient({
  oauthToken: functions.config().storyblok.oauth_token
});

const storyblokDeliver = new StoryblokClient({
  accessToken: functions.config().storyblok.access_token
});

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

function collectionType(componentName: string): string | undefined {
  let collectionType: string;
  switch (componentName) {
    case "kitchen":
      collectionType = "kitchens";
      break;
    default:
      return
  }
  return collectionType;
}

export async function fetchStory(storyId: number): Promise<StoryblokResult> {
  return await storyblok.get(`cdn/stories/${storyId}`, {
    version: "published"
  });
}

export async function createDish(dish: CreateStoryRequest<Dish>): Promise<StoryblokManagmentApiResult> {
  return await storyblok.post(`spaces/${spaceId}/stories`, {
    story: dish,
    publish: 1
  });
}

export async function updateDish(storyId: number, dish: CreateStoryRequest<Dish>): Promise<StoryblokManagmentApiResult> {
  return await storyblok.put(`spaces/${spaceId}/stories/${storyId}`, {
    story: dish,
    publish: 1
  })
}

export async function deleteDish(storyId: number): Promise<StoryblokManagmentApiResult> {
  return await storyblok.delete(`spaces/${spaceId}/stories/${storyId}`, {
    version: "published"
  });
}

export async function persistStory(res: Story): Promise<FirebaseFirestore.WriteResult> {
  const story = res.data.story;
  const storyId = String(story.id);

  const componentName = story.content.component;
  const type = collectionType(componentName);
  if (type == null) {
    return Promise.reject(new Error(`Couldn't map to collection. Unknown component: ${componentName}`));
  }
  return await admin.firestore().collection(type).doc(storyId).set(story);
}

export async function getAllStoryBlokData(): Promise<any> {
  let response = {}

  if (myCache.get(cacheKey)) {
    response = myCache.get(cacheKey)
  } else {
    const settings = await storyblokDeliver.get(`cdn/stories/?starts_with=settings`, {
      version: "published"
    });

    const kitchens = await storyblokDeliver.get(`cdn/stories/?starts_with=menus&resolve_relations=kitchen`, {
      version: "published"
    });

    response = {
      settings,
      kitchens
    }
    // Save data in cache
    myCache.set(cacheKey, response)
  }

  return new Promise((resolve, _) => resolve(response))
}

export async function clearStoryblokCache(): Promise<boolean> {
  console.log(await myCache.del(cacheKey), ' deleted')
  return new Promise((resolve, _) => resolve(true))
}
