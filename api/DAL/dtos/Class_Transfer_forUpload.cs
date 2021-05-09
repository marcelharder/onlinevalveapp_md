using System;

namespace api.DAL.dtos
{
    public class Class_Transfer_forUpload
    {

        public int Id { get; set; }
        public DateTime DepTime { get; set; }
        public DateTime ArrTime { get; set; }
        public string Reason { get; set; }
        public string DepartureCode { get; set; }
        public string ArrivalCode { get; set; }
        public int ValveId { get; set; }
    }
}