import { valveSize } from "./valveSize";

export interface TypeOfValve {
    ValveTypeId: number;
    No: number;
    uk_code: string;
    us_code: string;
    Description: string;
    Valve_size: valveSize[];
    Type: string;
    Vendor_description: string;
    Vendor_code: string;
    Model_code: string;
    image: string;
    Implant_position: string;
    countries: string;
}







