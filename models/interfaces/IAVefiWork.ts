// Interface definitions for AVefi Work-related types
// This file provides compatibility interfaces for existing code

export interface IAVefiData {
  [key: string]: any;
}

export interface IAVefiSingleResponse {
  data?: IAVefiData;
  [key: string]: any;
}

export interface IAVefiListResponse {
  data?: IAVefiData[];
  [key: string]: any;
}

export interface IAVefiWork {
  id?: string;
  handle?: string;
  category?: string;
  [key: string]: any;
}
