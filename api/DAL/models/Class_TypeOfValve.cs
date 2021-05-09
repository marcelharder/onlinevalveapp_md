using System.ComponentModel.DataAnnotations;

namespace api.DAL.models
{
    public class Class_TypeOfValve
    {
        public virtual int Id { get; set; }
        public int No { get; set; }
        public string Vendor_description { get; set; }
        public string Vendor_code { get; set; }
        public string Valve_size { get; set; }
        public string Model_code { get; set; }
        public string Implant_position { get; set; }
        public string uk_code { get; set; }
        public string us_code { get; set; }
        public string Description { get; set; }
        [Required]
        public string Type { get; set; }
        public string countries { get; set; }
    }
}
