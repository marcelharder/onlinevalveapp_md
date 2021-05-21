using System.ComponentModel.DataAnnotations;

namespace api.DAL.models
{
    public class Class_Valve_Size
    {
        [Key]
        public int SizeId { get; set; }
        public int Size { get; set; }
        public float EOA { get; set; }
        public Class_TypeOfValve VT { get; set; }
        public int ValveTypeId { get; set; }
    }
}
