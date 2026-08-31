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

// Cache endpoint hoạt động để không phải chờ timeout ở mỗi frame quét tự động
let cachedActiveUrl: string | null = null;

export const exploreApi = {
  detectObject: async (imageBlob: Blob): Promise<DetectionResponse> => {
    const formData = new FormData();
    formData.append('image', imageBlob, 'capture.jpg');

    const urls = cachedActiveUrl 
      ? [cachedActiveUrl, cachedActiveUrl === 'http://localhost:8002/api/v1/object/detect' ? 'http://localhost:8888/api/v1/object/detect' : 'http://localhost:8002/api/v1/object/detect']
      : ['http://localhost:8888/api/v1/object/detect', 'http://localhost:8002/api/v1/object/detect'];

    for (const url of urls) {
      try {
        const response = await axios.post<DetectionResponse>(url, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          timeout: 2000,
        });
        cachedActiveUrl = url; // Lưu URL hoạt động thành công
        return response.data;
      } catch (err) {
        // Thử URL tiếp theo nếu có
        cachedActiveUrl = null;
      }
    }

    throw new Error('Could not connect to Object Detection service on port 8888 or 8002');
  },
};

