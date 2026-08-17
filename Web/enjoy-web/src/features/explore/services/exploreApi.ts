import axios from 'axios';

export interface DetectionItem {
  box: [number, number, number, number]; // [x1, y1, x2, y2]
  confidence: number;
  class_id: number;
  class_name: string;
  bbox?: [number, number, number, number]; // [x, y, w, h] normalized coordinates (0 to 1)
}

export interface DetectionResponse {
  detections: DetectionItem[];
}

export const exploreApi = {
  detectObject: async (imageBlob: Blob): Promise<DetectionResponse> => {
    const formData = new FormData();
    formData.append('image', imageBlob, 'capture.jpg');
    
    const response = await axios.post<DetectionResponse>(
      'http://localhost:8002/api/v1/object/detect',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },
};
