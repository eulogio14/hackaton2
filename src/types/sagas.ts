export interface Saga {
  id: string;
  name: string;
  description?: string;
  [key: string]: any;
}

export interface SagaStage {
  id: string;
  order?: number;
  title?: string;
  narrative?: string;
  island?: {
    name?: string;
    lat?: number;
    lng?: number;
    x?: number;
    y?: number;
    [key: string]: any;
  };
  colors?: Record<string, string>;
  metrics?: Record<string, number | string>;
  [key: string]: any;
}

export interface SagaStory {
  saga: Saga;
  stages: SagaStage[];
  [key: string]: any;
}
