export interface Valve {
    valveId: number;
    no: number;
    description: string;
    vendor_code: string;
    vendor_name: string;
    valveSizes: string[];
    product_code: string;
    type: string;
    tfd:number;
    ppm:string;
    location: string;
    manufac_date: Date;
    expiry_date: Date;
    Implant_date: Date;
    serial_no: string;
    model_code: string;
    size: string;
    patchSize: string;
    image: string;
    implant_position: string;
    procedure_id: number;
    implanted: number;
    hospital_code: number;
}

