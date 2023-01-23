namespace api.DAL.models
{
    public class Class_Vendors
    {
        public virtual int Id { get; set; }
        public int No { get; set; }
        public string description { get; set; }
        public string contact { get; set; }
        public string address { get; set; }
        public string email { get; set; }
        public string telephone { get; set; }
        public string fax { get; set; }
        public string database_no { get; set; }
        public string spare2 { get; set; }
        public string active { get; set; }
        public string spare4 { get; set; }
        public string reps { get; set; }

        public Class_Vendors()
        {

        }
    }
}
