import { valveSize } from "./valveSize";

export interface TypeOfValve {
    valveTypeId: number;
    no: number;
    uk_code: string;
    us_code: string;
    description: string;
    valve_size: valveSize[];
    type: string;
    vendor_description: string;
    vendor_code: string;
    model_code: string;
    image: string;
    implant_position: string;
    countries: string;
}







