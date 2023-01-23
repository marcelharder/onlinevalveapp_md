using System;

namespace api.DAL.dtos
{
     public class ValveForReturnDTO
    {
        public virtual int valveId { get; set; }
        public int No { get; set; }
        public string Description { get; set; }
        public string Vendor_code { get; set; }
        public string Vendor_name { get; set; }
        public string Product_code { get; set; }
        public string Type { get; set; }
        public string Location { get; set; }
        public DateTime Manufac_date { get; set; }
        public DateTime Expiry_date { get; set; }
        public string Serial_no { get; set; }
        public string Image { get; set; }
        public string Model_code { get; set; }
        public string Size { get; set; }
        public string PatchSize { get; set; }
        public double TFD { get; set; }
        public string Implant_position { get; set; }
        public int Procedure_id { get; set; }
        public int implanted { get; set; }
        public int Hospital_code { get; set; }
        public DateTime Implant_date { get; set; }
    }
}