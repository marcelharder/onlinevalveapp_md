namespace api.DAL.models
{
    public class Class_Hospital
    {
        public virtual int Id { get; set; }
        public string Naam { get; set; }
        public string Adres { get; set; }
        public string PostalCode { get; set; }
        public string HospitalNo { get; set; }
        public string Country { get; set; }
        public string Image { get; set; }
        public string RefHospitals { get; set; }
        public string StandardRef { get; set; }
        public string Email { get; set; }
        public string Contact { get; set; }
        public string Contact_image { get; set; }
        public string Telephone { get; set; }
        public string Fax { get; set; }
        public string Logo { get; set; }
        public string mrnSample { get; set; }
        public string vendors { get; set; }
        public string rp { get; set; }
        public string SMS_mobile_number { get; set; }
        public string SMS_send_time { get; set; }
        public bool triggerOneMonth { get; set; }
        public bool triggerTwoMonth { get; set; }
        public bool triggerThreeMonth { get; set; }
        public string DBBackend { get; set; }

    }
}
