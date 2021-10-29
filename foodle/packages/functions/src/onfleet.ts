import axios, {AxiosResponse} from "axios";
import {CreateTaskProps, OnfleetTask} from "@onfleet/node-onfleet/Resources/Tasks";
import * as functions from "firebase-functions";

const onfleet = axios.create({
  baseURL: "https://onfleet.com/api/v2",
  timeout: 10000,
  auth: {
    username: functions.config().onfleet.api_key,
    password: ""
  },
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  }
});

export interface UpdateTaskRequest extends Partial<CreateTaskProps> {
  notes: string,
}

export interface OnfleetWebhook {
  actionContext: ActionContext;
  adminId: null;
  data: Data;
  taskId: string;
  time: number;
  triggerId: number;
  triggerName: string;
  workerId: string;
}

export interface ActionContext {
  id: string;
  type: string;
}

export interface Data {
  task: Task;
}

export interface Task {
  appearance: Appearance;
  completeAfter: null;
  completeBefore: number;
  completionDetails: CompletionDetails;
  creator: string;
  delayTime: null;
  dependencies: any[];
  destination: Destination;
  estimatedArrivalTime: null;
  estimatedCompletionTime: null;
  executor: string;
  feedback: any[];
  id: string;
  identity: Identity;
  merchant: string;
  metadata: any[];
  notes: string;
  organization: string;
  overrides: any;
  pickupTask: boolean;
  quantity: number;
  recipients: Recipient[];
  serviceTime: number;
  shortId: string;
  sourceTaskId: string;
  state: number;
  timeCreated: number;
  timeLastModified: number;
  trackingURL: string;
  trackingViewed: boolean;
  worker: string;
}

export interface Appearance {
  triangleColor: null;
}

export interface CompletionDetails {
  actions: any[];
  events: Event[];
  failureNotes: string;
  failureReason: string;
  firstLocation: any[];
  lastLocation: any[];
  notes: string;
  photoUploadId: null;
  photoUploadIds: any[];
  signatureUploadId: null;
  success: boolean;
  time: number;
  unavailableAttachments: any[];
}

export interface Event {
  name: string;
  time: number;
}

export interface Destination {
  address: Address;
  id: string;
  location: number[];
  metadata: any[];
  notes: string;
  timeCreated: number;
  timeLastModified: number;
}

export interface Address {
  apartment: string;
  city: string;
  country: string;
  name: string;
  number: string;
  postalCode: string;
  state: string;
  street: string;
}

export interface Identity {
  checksum: null;
  failedScanCount: number;
}

export interface Recipient {
  id: string;
  metadata: any[];
  name: string;
  notes: string;
  organization: string;
  phone: string;
  skipSMSNotifications: boolean;
  timeCreated: number;
  timeLastModified: number;
}

export async function createTask(task: CreateTaskProps): Promise<AxiosResponse<OnfleetTask>> {
  functions.logger.debug(JSON.stringify(task));
  return await onfleet.post("/tasks", task)
}

export async function updateTask(taskId: string, task: UpdateTaskRequest): Promise<AxiosResponse<OnfleetTask>>  {
  return await onfleet.put(`/tasks/${taskId}`, task)
}

export async function deleteTask(taskId: string): Promise<AxiosResponse> {
  return await onfleet.put(`/tasks/${taskId}`)
}
