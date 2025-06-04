export interface ApaczkaService {
  service_id: string;
  name: string;
  delivery_time: string;
  supplier: string;
  domestic: "0" | "1";
  pickup_courier: "0" | "1" | "2";
  door_to_door: "0" | "1";
  door_to_point: "0" | "1";
  point_to_point: "0" | "1";
  point_to_door: "0" | "1";
}

export interface ApaczkaServiceResponse {
  status: number;
  message: string;
  response: {
    services: ApaczkaService[];
  };
}

export interface ApaczkaError {
  status: number;
  message: string;
}
